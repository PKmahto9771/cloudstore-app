const express = require('express');
const mongoose = require('mongoose')
const Folder = require('../models/Folder');
const File = require('../models/File')
const checkAuth = require('../middlewares/auth');

const router = express.Router();

router.post('/', checkAuth, async(req, res) => {
    const {name, parentId} = req.body;
    console.log('🗂️ Creating new folder:', { name, parentId, userId: req.user._id });

    try{
        // Critical validation
        if (!name || name.trim() === '') {
            console.error('❌ Invalid folder name provided:', name);
            return res.status(400).json({ message: 'Folder name is required' });
        }

        const newFolder = new Folder({
            name,
            userId: req.user._id,
            parentId: parentId || null,       
        });

        console.log('💾 Saving folder to database...');
        await newFolder.save();
        console.log('✅ Folder created successfully:', newFolder._id);

        res.status(201).json({ message: 'Folder created', folder: newFolder });
    }
    catch(err){
        if (err.code === 11000) {
          return res.status(400).json({ message: 'Folder with this name already exists in this location.' });
        }
        console.error('❌ Error creating folder:', {
            name,
            parentId,
            userId: req.user._id,
            error: err.message,
            stack: err.stack
        });
        res.status(500).json({ message: 'Error creating folder', error: err.message });
    }
})

router.get('/', checkAuth, async (req, res) => {
    console.log('📁 Fetching root folder contents for user:', req.user._id);
    
    try {
        const folders = await Folder.find({ parentId: null, userId: req.user._id });
        console.log('✅ Found folders:', folders.length);
        
        const files = await File.aggregate([
            {
              $match: {
                folderId: null,
                userId: new mongoose.Types.ObjectId(req.user._id)
              }
            },
            { $sort: { version: -1 } }, 
            {
              $group: {
                _id: "$fileGroupId",
                file: { $first: "$$ROOT" }
              }
            },
            {
              $replaceRoot: { newRoot: "$file" } 
            },
            {
              $sort: { uploadedAt: -1 }
            }
          ]);
        console.log('✅ Found files:', files.length);
          
        // Fetch breadcrumb
        let breadcrumbs = [];
        let currentId = null;
        while (currentId) {
          const folder = await Folder.findById(currentId);
          if (!folder) break;
          breadcrumbs.unshift({ name: folder.name, _id: folder._id });
          currentId = folder.parentId;
        }
      
        console.log('🍞 Breadcrumbs generated:', breadcrumbs.length);
        if (req.accepts('json')) {
          res.json({ folders, files, breadcrumbs });
        } else {
          res.render('folder_view', { folders, files, breadcrumbs });
        }
    } catch (error) {
        console.error('❌ Error fetching root folder:', {
            userId: req.user._id,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error fetching folder contents', error: error.message });
    }
});

router.get('/:folderId', checkAuth, async (req, res) => {
    const folderId = req.params.folderId || null;
    console.log('📁 Fetching folder contents:', { folderId, userId: req.user._id });
  
    try {
        // Critical validation - check if folder exists and belongs to user
        if (folderId) {
            const folderExists = await Folder.findOne({ _id: folderId, userId: req.user._id });
            if (!folderExists) {
                console.error('❌ Folder not found or unauthorized:', folderId);
                return res.status(404).json({ message: 'Folder not found' });
            }
            console.log('✅ Folder access validated:', folderExists.name);
        }

        const folders = await Folder.find({ parentId: folderId, userId: req.user._id });
        console.log('✅ Found subfolders:', folders.length);
        
        const files = await File.aggregate([
            {
              $match: {
                folderId: new mongoose.Types.ObjectId(folderId),
                userId: new mongoose.Types.ObjectId(req.user._id)
              }
            },
            { $sort: { version: -1 } },
            {
              $group: {
                _id: "$fileGroupId",
                file: { $first: "$$ROOT" }
              }
            },
            {
              $replaceRoot: { newRoot: "$file" }
            },
            {
              $sort: { uploadedAt: -1 }
            }
          ]);
        console.log('✅ Found files in folder:', files.length);
          
        // Fetch breadcrumb
        let breadcrumbs = [];
        let currentId = folderId;
        console.log('🍞 Building breadcrumbs...');
        while (currentId) {
          const folder = await Folder.findById(currentId);
          if (!folder) {
            console.warn('⚠️ Breadcrumb folder not found:', currentId);
            break;
          }
          breadcrumbs.unshift({ name: folder.name, _id: folder._id });
          currentId = folder.parentId;
        }
        console.log('✅ Breadcrumbs built:', breadcrumbs.length);
      
        if (req.accepts('json')) {
            res.json({ folders, files, breadcrumbs });
        } else {
            res.render('folder_view', { folders, files, breadcrumbs });
        }
    } catch (error) {
        console.error('❌ Error fetching folder contents:', {
            folderId,
            userId: req.user._id,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error fetching folder contents', error: error.message });
    }
});

router.get('/:parentId/contents', async(req, res) => {
    const parentId = req.params.parentId === 'root' ? null : req.params.parentId;

    try{
        const folders = await Folder.findOne({userId: req.user._id, parentId});
        const files = await File.findOne({userId: req.user._id, folderId:parentId});
        res.json({Folders:folders, Files:files});
    }
    catch(err){
        res.status(500).json({message:'failed to fetch folder contents', error:err.message});
    }
})

module.exports = router;

