const masterok = require('./dist/index');

const app = async (req, res) => {
  await masterok();
  res.status(204).end();
};

exports.masterok = app;

