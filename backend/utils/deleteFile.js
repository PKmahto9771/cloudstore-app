const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('./r2');

const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
  });

  await r2.send(command);
};

module.exports = deleteFile;
