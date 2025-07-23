require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

console.log('🔧 Initializing R2 client...');

// Critical validation
if (!process.env.CLOUDFLARE_R2_ACCESS_KEY || !process.env.CLOUDFLARE_R2_SECRET_KEY || !process.env.CLOUDFLARE_R2_ENDPOINT) {
    console.error('❌ Missing critical R2 environment variables:', {
        hasAccessKey: !!process.env.CLOUDFLARE_R2_ACCESS_KEY,
        hasSecretKey: !!process.env.CLOUDFLARE_R2_SECRET_KEY,
        hasEndpoint: !!process.env.CLOUDFLARE_R2_ENDPOINT
    });
    throw new Error('Missing R2 configuration');
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
  },
  forcePathStyle: true,
});

console.log('✅ R2 client initialized successfully');

module.exports = r2;

