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
