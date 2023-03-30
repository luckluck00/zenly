const ConfigCypto = require('../helpers/ConfigCypto');

function decrypt(decrypt) {
  const configCypto = new ConfigCypto('qwer34321pccu22222201234567890qa');// 32字串
  configCypto.decryptConfig(decrypt);
  // console.log(decrypt);
}
const config = {};
config.MAX_ERROR_TIMES = 5;
let type = 'development';
if (process.env.NODE_ENV === 'production') {
  type = 'production';
  config.debug = false;
} else {
  type = 'development';
  config.debug = true;
}
config.dbConfig = require(`./${type}/DbConfig`);
decrypt(require(`./${type}/DbConfig`));
module.exports = config;