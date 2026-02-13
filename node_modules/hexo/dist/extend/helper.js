"use strict";
/**
 * A helper makes it easy to quickly add snippets to your templates. We recommend using helpers instead of templates when you’re dealing with more complicated code.
 */
class Helper {
    constructor() {
        this.store = {};
    }
    /**
     * @returns {Store} - The plugin store
     */
    list() {
        return this.store;
    }
    /**
     * Get helper plugin function by name
     * @param {String} name - The name of the helper plugin
     * @returns {StoreFunction}
     */
    get(name) {
        return this.store[name];
    }
    /**
     * Register a helper plugin
     * @param {String} name - The name of the helper plugin
     * @param {StoreFunction} fn - The helper plugin function
     */
    register(name, fn) {
        if (!name)
            throw new TypeError('name is required');
        if (typeof fn !== 'function')
            throw new TypeError('fn must be a function');
        this.store[name] = fn;
    }
}
module.exports = Helper;
//# sourceMappingURL=helper.js.map