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
