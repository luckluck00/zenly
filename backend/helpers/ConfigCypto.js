const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

class CryptoAES256 {
  constructor(key) {
    this.key = Buffer.from(key, 'utf8');
  }

  // 加密
  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  // 解密
  decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, this.key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  decryptConfig(obj) {
    if (typeof obj !== 'object') {
      return;
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object') {
          this.decryptConfig(value);
        } else if (typeof value === 'string') {
          if (value.indexOf('ENC(') === 0 && value.lastIndexOf(')') === value.length - 1) {
            const encryptMsg = value.substring(4, value.length - 1);
            obj[key] = this.decrypt(encryptMsg);
          }
        } else if (typeof value === 'array') {
          for (const item of value) {
            if (typeof item === 'object') {
              this.decryptConfig(item);
            }
          }
        } else {
          continue;
        }
      }
    }
  }
}

// const key = Buffer.from('', 'utf8');
// const key = crypto.randomBytes(32); // 32 bytes = 256 bits
// console.log(key.toString('utf8'));
// const cryptoAES256 = new CryptoAES256(key);

// 示例：加密和解密文本
// const text = 'ffff';
// const encryptedText = cryptoAES256.encrypt(text);
// console.log(encryptedText); // 輸出加密後的文本
// const decryptedText = cryptoAES256.decrypt(encryptedText);
// console.log(decryptedText); // 輸出解密後的文本


module.exports = CryptoAES256;