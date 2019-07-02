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

