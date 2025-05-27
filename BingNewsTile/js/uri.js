(function (global) {
    function UriHelper(uri) {
        var _url = "";
        var _params = {};

        function parse(uriStr) {
            var parts = uriStr.split("?");
            var base = parts[0];
            var query = parts[1] || "";
            var obj = {};
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var kv = pairs[i].split("=");
                if (kv.length === 2) {
                    var key = decodeURIComponent(kv[0]);
                    var val = decodeURIComponent(kv[1]);
                    obj[key] = val;
                }
            }
            return { url: base, params: obj };
        }

        function buildUrl(url, params) {
            var query = [];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var val = params[key];
                    if (val != null && val !== "") {
                        query.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                    }
                }
            }
            return query.length ? url + "?" + query.join("&") : url;
        }

        Object.defineProperty(this, "url", {
            get: function () {
                return _url;
            },
            set: function (value) {
                if (typeof value === "string") {
                    var parsed = parse(value);
                    _url = parsed.url;
                    _params = parsed.params;
                }
            },
            enumerable: true
        });

        Object.defineProperty(this, "params", {
            get: function () {
                return _params;
            },
            set: function (obj) {
                if (typeof obj === "object") {
                    var newParams = {};
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            var val = obj[key];
                            if (val != null && val !== "") {
                                newParams[key] = val;
                            }
                        }
                    }
                    _params = newParams;
                }
            },
            enumerable: true
        });

        this.toString = function () {
            return buildUrl(_url, _params);
        };

        // Initialize if uri is provided
        if (typeof uri === "string") {
            this.url = uri;
        }
    }

    global.UriHelper = UriHelper;
})(this);
