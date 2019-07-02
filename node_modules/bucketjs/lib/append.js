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
