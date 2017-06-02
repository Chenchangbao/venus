export var Inject = (...args) => {
    if (typeof args[0] === 'function') {
        if (args[2]) {
            const fn = args[2].value;
            fn.$inject = getParamNames(args[0]);
        } else {
            args[0].$inject = getParamNames(args[0])
        }
    } else {
        return function decorator(target, key, descriptor) {
            if (descriptor) {
                const fn = descriptor.value;
                fn.$inject = args;
            } else {
                target.$inject = args;
            }
        };
    }

    function getParamNames(func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }
}