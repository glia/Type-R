import * as tslib_1 from "tslib";
import { Link } from '../link';
export var RecordLinksMixin = {
    linkAt: function (key) {
        return cacheLink(getLinksCache(this), this, key);
    },
    linkPath: function (path, options) {
        return new RecordDeepLink(this, path, options);
    },
    linkAll: function () {
        var links = getLinksCache(this);
        if (arguments.length) {
            for (var i = 0; i < arguments.length; i++) {
                cacheLink(links, this, arguments[i]);
            }
        }
        else {
            var attributes = this.attributes;
            for (var key in attributes) {
                attributes[key] === void 0 || cacheLink(links, this, key);
            }
        }
        return links;
    }
};
function getLinksCache(record) {
    return record._links || (record._links = new record.AttributesCopy({}));
}
function cacheLink(links, record, key) {
    var cached = links[key], value = record[key];
    return cached && cached.value === value ? cached
        : links[key] = new RecordLink(record, key, value);
}
var RecordLink = (function (_super) {
    tslib_1.__extends(RecordLink, _super);
    function RecordLink(record, attr, value) {
        var _this = _super.call(this, value) || this;
        _this.record = record;
        _this.attr = attr;
        return _this;
    }
    RecordLink.prototype.set = function (x) {
        this.record[this.attr] = x;
    };
    Object.defineProperty(RecordLink.prototype, "error", {
        get: function () {
            return this._error === void 0 ?
                this.record.getValidationError(this.attr) :
                this._error;
        },
        set: function (x) {
            this._error = x;
        },
        enumerable: true,
        configurable: true
    });
    return RecordLink;
}(Link));
export { RecordLink };
var RecordDeepLink = (function (_super) {
    tslib_1.__extends(RecordDeepLink, _super);
    function RecordDeepLink(record, path, options) {
        var _this = _super.call(this, record.deepGet(path)) || this;
        _this.record = record;
        _this.path = path;
        _this.options = options;
        return _this;
    }
    Object.defineProperty(RecordDeepLink.prototype, "error", {
        get: function () {
            if (this._error === void 0) {
                this._error = this.record.deepValidationError(this.path) || null;
            }
            return this._error;
        },
        set: function (x) {
            this._error = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecordDeepLink.prototype, "_changeToken", {
        get: function () {
            return this.record._changeToken;
        },
        enumerable: true,
        configurable: true
    });
    RecordDeepLink.prototype.set = function (x) {
        this.record.deepSet(this.path, x, this.options);
    };
    return RecordDeepLink;
}(Link));
export { RecordDeepLink };
//# sourceMappingURL=links.js.map