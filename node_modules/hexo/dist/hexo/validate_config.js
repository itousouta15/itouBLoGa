"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const assert_1 = __importDefault(require("assert"));
module.exports = (ctx) => {
    const { config, log } = ctx;
    log.info('Validating config');
    // Validation for config.url && config.root
    if (typeof config.url !== 'string') {
        throw new TypeError(`Invalid config detected: "url" should be string, not ${typeof config.url}!`);
    }
    try {
        // eslint-disable-next-line no-new
        new URL(config.url);
        (0, assert_1.default)(new URL(config.url).protocol.startsWith('http'));
    }
    catch {
        throw new TypeError('Invalid config detected: "url" should be a valid URL!');
    }
    if (typeof config.root !== 'string') {
        throw new TypeError(`Invalid config detected: "root" should be string, not ${typeof config.root}!`);
    }
    if (config.root.trim().length <= 0) {
        throw new TypeError('Invalid config detected: "root" should not be empty!');
    }
};
//# sourceMappingURL=validate_config.js.map