const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const checkAuth = require('../middlewares/auth');
const uploadFile = require('../utils/uploadFile');
const downloadFile = require('../utils/downloadFile');
const deleteFile = require('../utils/deleteFile');
const generateSignedUrl = require('../utils/generateSignedUrl');
const File = require('../models/File');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits:{
        fileSize: 100*1024*1024*8,
    }
});

router.get('/upload', checkAuth, (req, res) => {
    res.render('upload');
});

router.get('/download', checkAuth, (req, res) => {
    res.render('download');
});

router.post('/upload', checkAuth, upload.single('file'), async (req, res) => {
    console.log('📤 Starting file upload process...');
    
    try {
      const file = req.file;
      const userId = req.user._id;
      const originalName = file.originalname;
      const folderId = req.body.folderId || null;
      // log entire request details at once
      console.log('📋 Upload request details:', req.body);

      console.log('📋 Upload details:', {
        originalName,
        size: file.size,
        mimetype: file.mimetype,
        userId,
        folderId
      });
  
      // Critical validation
      if (!file) {
        console.error('❌ No file provided in upload');
        return res.status(400).json({ message: 'No file provided' });
      }
  
      // Extract base name and extension
      const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const extension = originalName.split('.').pop();
      console.log('🏷️ File name parsing:', { baseName, extension });
  
      // Check if a file with the same name was uploaded before
      console.log('🔍 Checking for existing files...');
      const existingFile = await File.findOne({ userId, originalName, folderId }).sort({ version: -1 });
  
      const version = existingFile ? existingFile.version + 1 : 1;
      const fileGroupId = existingFile ? existingFile.fileGroupId : crypto.randomUUID();
      
      console.log('📝 Version info:', {
        hasExisting: !!existingFile,
        version,
        fileGroupId
      });
  
      // Create versioned key for storage
      const versionedKey = `${baseName}_v${version}.${extension}`;
      console.log('🔑 Generated versioned key:', versionedKey);
  
      // Upload file to R2 - CRITICAL OPERATION
      console.log('☁️ Uploading to R2...');
      const r2Response = await uploadFile(file, versionedKey);

      // Save file metadata to DB
      const newFile = new File({
        userId,
        originalName,
        storageKey: r2Response.Key,
        version,
        fileGroupId,
        folderId
      });
  
      await newFile.save();
  
    res.json({
      message: 'File uploaded with versioning',
      fileId: newFile._id,
      fileUrl: r2Response.Location,
      key: r2Response.Key,
      version,
      redirectUrl: folderId ? `/folders/${folderId}` : '/folders'
    });
    } catch (err) {
      res.status(500).json({ message: 'File upload failed', error: err.message });
    }
});  

router.get('/versions/:fileGroupId', checkAuth, async (req, res) => {
    try {
      const { fileGroupId } = req.params;
  
      const versions = await File.find({ fileGroupId, userId: req.user._id})
        .sort({ version: -1 })
        .lean();
  
      if (!versions.length) {
        return res.status(404).send('No versions found.');
      }

      // return json 
        if (req.accepts('json')) {
            return res.json({ versions });
        }
        if (req.accepts('html')) {
            return res.render('versions', { versions });
        }
    } catch (err) {
      res.status(500).send('Error fetching file versions.');
    }
});

router.post('/share/:fileId', checkAuth, async(req, res) => {
    try{
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if (!file || !file.userId.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized or file not found' });
        }

        const token = crypto.randomBytes(16).toString('hex');
        file.sharedToken = token;
        file.isShared = true;
        await file.save();
        
        const shareUrl = `${req.protocol}://${req.get('host')}/api/files/shared/${token}`;
        res.json({ shareUrl });        
    }
    catch(err){
        res.status(500).json({ message: 'Error generating share link', err });
    }
})

router.get('/shared/:token', async(req, res) => {
    try{
        const token = req.params.token;
        const file = await File.findOne({sharedToken: token, isShared: true});

        if(!file){
            return res.status(404).json({message: 'Invalid or expired link'});
        }

        await downloadFile(file.storageKey, res);
    }
    catch(err){
        res.status(500).json({ message: 'Download failed', error: err.message});
    }
})

router.post('/unshare/:fileId', checkAuth, async(req, res) => {
    try{
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);

        if (!file || !file.userId.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized or file not found' });
        }     
        
        file.sharedToken = null;
        file.isShared = false;
        await file.save();

        return res.status(200).json({message: 'sharing disabled'});
    }
    catch(err){
        return res.status(500).json({ message: 'Error disabling share link', err });
    }
})  

router.get('/signed-url/:key', checkAuth, async(req, res) => {
    try{
        const key = req.params.key;
        const expiresIn = parseInt(req.query.expiresIn || 600);

        const signedUrl = await generateSignedUrl(key, expiresIn);

        return res.status(200).json({ signedUrl, expiresIn });
    }
    catch(err){
        res.status(500).json({ message: 'Failed to generate signed URL', error: err.message });
    }
})
  
router.get('/download/:key', checkAuth, async(req, res) => {
    try{
        const fileKey = req.params.key;
        await downloadFile(fileKey, res);
    }
    catch(err){
        res.status(500).json({message: 'File download failed', err: err.message});
    }
})

router.delete('/:key', checkAuth, async(req, res) => {
    try{
        const fileKey = req.params.key;
        await deleteFile(fileKey);
        await File.findOneAndDelete({storageKey: fileKey});
        res.send('File deleted successfully');
    }
    catch(err){
        res.status(500).json({message: 'File deletion failed', err});
    }
})

module.exports = router;
