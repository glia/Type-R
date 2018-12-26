var ArrayMixin = (function () {
    function ArrayMixin() {
    }
    ArrayMixin.prototype.map = function (a_fun, context) {
        var models = this.models, res = Array(models.length), iteratee = context ? a_fun.bind(context) : a_fun;
        for (var i = 0, j = 0; i < models.length; i++) {
            var val = iteratee(models[i], i);
            val === void 0 || (res[j++] = val);
        }
        if (i !== j) {
            res.length = j;
        }
        return res;
    };
    ArrayMixin.prototype.reduce = function (iteratee, init) {
        return init === void 0 ? this.models.reduce(iteratee) : this.models.reduce(iteratee, init);
    };
    ArrayMixin.prototype.slice = function (begin, end) {
        return this.models.slice(begin, end);
    };
    ArrayMixin.prototype.indexOf = function (modelOrId) {
        return this.models.indexOf(this.get(modelOrId));
    };
    ArrayMixin.prototype.filter = function (iteratee, context) {
        return this.models.filter(toPredicateFunction(iteratee), context);
    };
    ArrayMixin.prototype.find = function (iteratee, context) {
        return this.models.find(toPredicateFunction(iteratee), context);
    };
    ArrayMixin.prototype.some = function (iteratee, context) {
        return this.models.some(toPredicateFunction(iteratee), context);
    };
    ArrayMixin.prototype.each = function (a_fun, context) {
        var models = this.models, iteratee = context ? a_fun.bind(context) : a_fun;
        for (var i = 0; i < models.length; i++) {
            var res = iteratee(models[i], i);
            if (res !== void 0)
                return res;
        }
    };
    ArrayMixin.prototype.forEach = function (iteratee, context) {
        this.each(iteratee, context);
    };
    ArrayMixin.prototype.values = function () {
        return this.models.values();
    };
    ArrayMixin.prototype.entries = function () {
        return this.models.entries();
    };
    ArrayMixin.prototype.every = function (iteratee, context) {
        return this.models.every(toPredicateFunction(iteratee), context);
    };
    ArrayMixin.prototype.pluck = function (key) {
        return this.map(function (model) { return model[key]; });
    };
    return ArrayMixin;
}());
export { ArrayMixin };
var noOp = function (x) { return x; };
function toPredicateFunction(iteratee, context) {
    if (iteratee == null)
        return noOp;
    switch (typeof iteratee) {
        case 'function': return iteratee;
        case 'object':
            var keys_1 = Object.keys(iteratee);
            return function (x) {
                for (var _i = 0, keys_2 = keys_1; _i < keys_2.length; _i++) {
                    var key = keys_2[_i];
                    if (iteratee[key] !== x[key])
                        return false;
                }
                return true;
            };
        default: throw new Error('Invalid iteratee');
    }
}
//# sourceMappingURL=arrayMethods.js.map