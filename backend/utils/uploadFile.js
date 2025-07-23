const { PutObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('./r2');

const uploadFile = async (file, key) => {
  console.log('🔄 Starting file upload process...');
  
  // Critical validation - file object
  if (!file || !file.buffer || !file.originalname) {
    console.error('❌ Invalid file object received:', { 
      hasFile: !!file, 
      hasBuffer: !!file?.buffer, 
      hasOriginalname: !!file?.originalname 
    });
    throw new Error('Invalid file object');
  }
  
  console.log('✅ File validation passed:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });
  
  const finalKey = key || `${Date.now()}-${file.originalname}`;
  console.log('🔑 Generated file key:', finalKey);
  
  // Critical point - environment variables
  if (!process.env.CLOUDFLARE_R2_BUCKET_NAME || !process.env.CLOUDFLARE_R2_ENDPOINT) {
    console.error('❌ Missing critical environment variables:', {
      hasBucket: !!process.env.CLOUDFLARE_R2_BUCKET_NAME,
      hasEndpoint: !!process.env.CLOUDFLARE_R2_ENDPOINT
    });
    throw new Error('Missing R2 configuration');
  }
  
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: finalKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  
  console.log('📤 Attempting R2 upload...');
  try {
    const result = await r2.send(command);
    console.log('✅ R2 upload successful for key:', finalKey);
    return {
      Location: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${finalKey}`,
      Key: finalKey,
    };
  } catch (error) {
    console.error('❌ R2 upload failed:', {
      key: finalKey,
      error: error.message,
      code: error.code
    });
    throw error;
  }
};

module.exports = uploadFile;
