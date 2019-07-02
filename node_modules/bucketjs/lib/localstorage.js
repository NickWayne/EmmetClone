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
