const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const dotenv = require('dotenv');

dotenv.config();

const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function verifySupabaseJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['ES256'],
        issuer: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/auth/v1`,
        audience: 'authenticated',
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}

module.exports = {
  verifySupabaseJWT,
};
