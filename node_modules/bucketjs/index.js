module.exports = {
    require: function(resource, options, fn) {
        return "bucket.require('" +
            resource + "'," + JSON.stringify(options) + ","
            + (fn ? fn.toString() : 'undefined') +
            ");";
    },
    PATH: typeof __dirname === "undefined" ? null : __dirname
};
