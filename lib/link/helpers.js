var ArrayProto = Array.prototype, ObjectProto = Object.prototype;
export function helpers(value) {
    if (value && typeof value === 'object') {
        switch (Object.getPrototypeOf(value)) {
            case ArrayProto: return arrayHelpers;
            case ObjectProto: return objectHelpers;
        }
    }
    return dummyHelpers;
}
var dummyHelpers = {
    clone: function (value) { return value; },
    map: function (link, fun) { return []; },
    remove: function (value) { return value; }
};
export var objectHelpers = {
    map: function (link, iterator) {
        var mapped = [];
        for (var key in link.value) {
            var element = iterator(link.at(key), key);
            element === void 0 || (mapped.push(element));
        }
        return mapped;
    },
    remove: function (object, key) {
        delete object[key];
        return object;
    },
    clone: function (object) {
        var cloned = {};
        for (var key in object) {
            cloned[key] = object[key];
        }
        return cloned;
    }
};
export var arrayHelpers = {
    clone: function (array) {
        return array.slice();
    },
    remove: function (array, i) {
        array.splice(i, 1);
        return array;
    },
    map: function (link, iterator) {
        var length = link.value.length, mapped = Array(length);
        for (var i = 0, j = 0; i < length; i++) {
            var y = iterator(link.at(i), i);
            y === void 0 || (mapped[j++] = y);
        }
        mapped.length === j || (mapped.length = j);
        return mapped;
    }
};
//# sourceMappingURL=helpers.js.map