const { GetObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('./r2');

const downloadFile = async (key, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });

    const data = await r2.send(command);

    res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${key}"`);
    data.Body.pipe(res);
  } catch (err) {
    console.error('[DOWNLOAD ERROR]', err); 
    throw new Error(err.message || 'Unknown download error');
  }
};

module.exports = downloadFile;
