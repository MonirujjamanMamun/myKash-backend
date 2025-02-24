require('dotenv').config();

const allSecret = {
  dev: {
    port: process.env.PORT || 8181,
  },
  db: {
    mongo_uri: process.env.MONGO_URI,
  },
};

module.exports = { ...allSecret.dev, ...allSecret.db };
