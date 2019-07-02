/**
 * Get cached item from local storage by key.
 *
 * @param {String} key - Cache key.
 * @param {String} [versionTag] - Special tag for invalidate cache.
 * @returns {Object|String|Number|Null}
 * @private
 */
module.getItem = function(key, versionTag) {
    var item = this.ls.get(key);

    if (!item ||
        item.version !== (versionTag || null) ||
        !(item.expire === 0 || (+new Date() <= item.expire + item.timestamp))) {

        this.ls.remove(key);
        item = {};
    }

    return item.data || null;
};
