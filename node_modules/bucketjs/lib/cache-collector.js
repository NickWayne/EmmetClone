module.collect = function() {
    this.ls.forEach(function(key) {
        this.ls.get(key);
    }, this);
};

setTimeout(function() {
    module.collect();
}, 0);
