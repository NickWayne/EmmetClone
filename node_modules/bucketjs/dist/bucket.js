(function(window, document) {
'use strict';

var module = window['bucket'] = {};

/**
 * Append element to head or body.
 *
 * @param {Node} elem - Appended element.
 * @param {Boolean} [bottom=false] Append to body.
 */
module.append = function(elem, bottom) {
    var tag = bottom ? 'body' : 'head';
    var node  =  document[tag] || document.getElementsByTagName(tag)[0];

    if (bottom && !node) {
        throw new Error('You should put your require script into body');
    }

    node.appendChild(elem);
};

module.collect = function() {
    this.ls.forEach(function(key) {
        this.ls.get(key);
    }, this);
};

setTimeout(function() {
    module.collect();
}, 0);

/**
 * Create script, style or link element.
 *
 * @param {String} source - Source data or link to source.
 * @param {Object} [options] - Options.
 * @param {Boolean} [options.defer=false] - Add defer attribute to script.
 * @param {Boolean} [options.style=false] - Create as style.
 * @param {Boolean} [options.link=false] - Create as link for style or script with src.
 * @returns {Element}
 */
module.createElement = function(source, options) {
    options = options || {};

    var tag = 'script';

    if (options.style) {
        tag = options.link ? 'link' : 'style';
    }

    var elem = document.createElement(tag);

    if (options.style) {
        // if styles
        if (options.link) {
            elem.rel = 'stylesheet';
            elem.href = source;
        } else if ('textContent' in elem) {
            // modern
            elem.textContent = source;
        } else if (elem.styleSheet) {
            // ie < 9
            elem.styleSheet.cssText = source;
        } else {
            // another
            elem.appendChild(document.createTextNode(source));
        }
    } else {
        // if script
        elem[options.link ? 'src' : 'text'] = source;
        elem.defer = !!options.defer;
    }

    return elem;
};

/**
 * Get resource from server.
 *
 * @param {String} url - Resource url.
 * @param {Object|Function} [optionsOrDone] - Options or done callback.
 * @param {boolean} [optionsOrDone.sync=false] - Do sync request.
 * @param {boolean} [optionsOrDone.timeout] - Request timeout.
 * @param {Function} done - Callback.
 */
module.fetch = function(url, optionsOrDone, done) {
    var toStr = Object.prototype.toString;
    var options = optionsOrDone;

    if (toStr.call(optionsOrDone) === '[object Function]') {
        done = optionsOrDone;
        options = {};
    }

    if (toStr.call(done) !== '[object Function]')
        throw new Error('Bad arguments');

    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, !options.sync);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            clearTimeout(this._timeout);
            done(xhr.status !== 200, xhr.responseText);
        }
    };

    xhr.onerror = function() {
        xhr._timeout && clearTimeout(this._timeout);
        done(true);
    };

    xhr._timeout = options.timeout && setTimeout(function() {
        if (xhr.readyState < 4)  {
            xhr.abort();
            done(true);
        }
    }, options.timeout);

    xhr.send();
};


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

module.ls = (function() {
    var ls = null;
    var ns = 'bucket:';

    try { ls = window['localStorage']; } catch(e) { /* Chrome throws exception if cookie is disabled  */}

    return {
        'get' : function(key) {
            var item = null;

            try { item = JSON.parse(ls.getItem(ns + key)); } catch (err) {}

            return item;
        },

        'set': function(key, data) {
            this.remove(key);
            try { ls.setItem(ns + key, JSON.stringify(data)); } catch (err) {}
        },

        remove: function(key) {
            try { ls.removeItem(ns + key); } catch (err) {}
        },

        forEach: function(fn, ctx) {
            try {
                Object.keys(ls).forEach(function(key) {
                    if (/^bucket:/.test(key)) fn.call(ctx || module, key.split(':')[1]);
                });
            } catch (err) {}
        }
    };
})();

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

var pendingBank = {};
var pendingCounter = {};
var invokeBank = {};
var isResolved = {};

module._waitFor = function(key, deps, fn) {
    if (!deps) {
        return fn();
    }

    if (pendingCounter[key] === undefined) {
        pendingCounter[key] = 0;
    }

    invokeBank[key] = fn;

    [].concat(deps).forEach(function(item) {
        if (pendingBank[key] && pendingBank[key][item]) {
            throw new Error('Circular dependency pair:', item, key);
        }

        if (!isResolved[item]) {
            pendingCounter[key]++;
            (pendingBank[item] || (pendingBank[item] = {}))[key] = true;
        }
    });

    if (!pendingCounter[key]) {
        fn();
    }
};

module._resolve = function(key) {
    Object.keys(pendingBank[key] || {}).forEach(function(item) {
        if (pendingCounter[item]) --pendingCounter[item] || invokeBank[item]();
    }, this);

    isResolved[key] = true;
};


})(this, document);