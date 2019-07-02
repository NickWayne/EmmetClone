/**
 * Cache data in local storage.
 *
 * @param {String} key - Cached key.
 * @param {String} data - Cached content.
 * @param {Object} [options] - Options.
 * @param {Number} [options.expire = 0] - Expire in ms, if 0 then is infinity.
 * @param {String} [options.version] - Special invalidation tag.
 * @private
 */
module.setItem = function(key, data, options) {
    options = options || {};

    this.ls.set(key, {
        timestamp: +new Date(),
        expire: options.expire || 0,
        version: options.version || null,
        data: data
    });

    return data;
};
