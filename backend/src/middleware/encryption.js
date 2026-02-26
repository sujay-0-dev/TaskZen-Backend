const CryptoJS = require('crypto-js');

const AES_KEY = process.env.AES_SECRET_KEY;

/**
 * Encrypt a string value with AES
 */
const encrypt = (text) => {
    if (!text) return text;
    return CryptoJS.AES.encrypt(String(text), AES_KEY).toString();
};

/**
 * Decrypt an AES-encrypted string
 */
const decrypt = (ciphertext) => {
    if (!ciphertext) return ciphertext;
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, AES_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return ciphertext;
    }
};

/**
 * Middleware: encrypt specified response fields before sending
 */
const encryptResponseFields = (fields) => (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        if (data && data.data) {
            const encryptFields = (obj) => {
                if (Array.isArray(obj)) return obj.map(encryptFields);
                if (obj && typeof obj === 'object') {
                    const result = { ...obj };
                    fields.forEach((field) => {
                        if (result[field] !== undefined) {
                            result[field] = encrypt(result[field]);
                        }
                    });
                    return result;
                }
                return obj;
            };
            data.data = encryptFields(data.data);
        }
        return originalJson(data);
    };
    next();
};

/**
 * Middleware: decrypt specified request body fields before processing
 */
const decryptRequestFields = (fields) => (req, res, next) => {
    if (req.body) {
        fields.forEach((field) => {
            if (req.body[field]) {
                req.body[field] = decrypt(req.body[field]);
            }
        });
    }
    next();
};

module.exports = { encrypt, decrypt, encryptResponseFields, decryptRequestFields };
