/**
 * Load and cache static bundle.
 *
 * @param {String} url - Resource url.
 * @param {Object|Function} [optionsOrDone] - Options or done callback.
 * @param {String} [optionsOrDone.key=resource] - Cache key.
 * @param {String} [optionsOrDone.version=null] - Unique tag for invalidate cache.
 * @param {Number} [optionsOrDone.expire=0] - Expiration time in ms if 0 than infinity.
 * @param {Number} [optionsOrDone.timeout=5000] - Request timeout in ms.
 * @param {Boolean} [optionsOrDone.sync=false] - Load resource sync.
 * @param {Boolean} [optionsOrDone.defer=false] - Add defer to script.
 * @param {Boolean} [optionsOrDone.bottom=false] - Append script to body.
 * @param {Boolean} [optionsOrDone.link=false] - Classic load as link for css and with src for script.
 * @param {Array} [optionsOrDone.waitFor] - Append resource after resources from list.
 * @param {Function} [done] - Done callback.
 */
module.require = function require(url, optionsOrDone, done) {
    var options = optionsOrDone || {};

    if (typeof optionsOrDone === 'function') {
        done = optionsOrDone;
        options = {};
    }

    var key = options.key || url;

    var item = options.link ? url : this.getItem(key, options.version);
    var isCss =  /.css$|.css\?/.test(url);

    if (isCss && options.defer)
        throw new Error('Bad options');

    function invoke(item, link) {
        module.append(
            module.createElement(item, { defer: options.defer, style: isCss, link: link }),
            options.bottom);

        done && done();
        module._resolve(key);
    }

    if (!item) {
        this.fetch(url, { sync: options.sync, timeout: options.timeout || 5000 }, function(err, result) {
            err || module.setItem(key, result, { expire: options.expire, version: options.version });

            module._waitFor(key, options.waitFor || null, function() {
                invoke.call(module, err ? url : result, !!err);
            });
        });
    } else {
        module._waitFor(key, options.waitFor || null, function() {
            invoke.call(module, item, !!options.link);
        });
    }
};
