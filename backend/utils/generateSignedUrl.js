const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const r2 = require('./r2'); 

const generateSignedUrl = async (key, expiresInSeconds = 60 * 10) => {
  const command = new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(r2, command, { expiresIn: expiresInSeconds });
  return url;
};

module.exports = generateSignedUrl;
