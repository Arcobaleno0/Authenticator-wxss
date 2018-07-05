/*jshint esversion: 6 */
(() => {
    "use strict";
    var url = require("./url.js");
    exports.parseURL = function(e) {
        var r = url.parse(e, !0),
            t = r.pathname.substr(1).split(":"),
            s = Object.assign({
                secret: '',
                encoding: "base32",
                algorithm: "SHA1",
                counter: null,
                issuer: '',
                type: "totp",
                digits: 6,
                epoch: 0,
                step: 30,
                label: '',
            }, r.query);
        if (!('hostname' in r)) {
            return !1;
        }
        switch (r.hostname.toLowerCase()) {
            case 'hotp':
            case 'totp':
                break;
            default:
                return !1;
                // break;
        }
        if (s.secret.length === 0) {
            return !1;
        }
        s.type = r.hostname.toLowerCase();
        s.counter = ((s.type == 'totp') ? null : 0);
        if (s.label.length === 0) {
            s.label = decodeURIComponent(((t.length == 1) ? t[0] : t[1]));
        }
        if (s.issuer.length === 0 && t.length > 1) {
            s.issuer = decodeURIComponent(t[0]);
        }
        if ('period' in s) {
            s.step = parseInt(s.period, 10);
            delete s.period;
        }
        s.digits = parseInt(s.digits, 10);
        s.epoch = parseInt(s.epoch, 10);
        return s;
    };
})();