/*jshint esversion: 6 */
(() => {
    "use strict";
    var url = require("./url.js"),
        Ga = require("./Gauth.js");
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
        if ((!('secret' in s)) || (s.secret.length === 0)) {
            return !1;
        }
        s.type = r.hostname.toLowerCase();
        s.counter = ((s.type == 'totp') ? null : 0);
        return s.label = decodeURIComponent(t[0]), s.issuer = decodeURIComponent(t.length > 1 ? t[1] : ""), s;
    };
    exports.parse_code = function(e) {
        var data = [];
        for (let k in e) {
            data.push({
                issuer: e[k].issuer,
                access: (e[k].label.length > 0 && e[k].issuer.length > 0) ? e[k].issuer + " (" + e[k].label + ")" : (e[k].issuer.length > 0 ? e[k].issuer : (e[k].label.length > 0 ? e[k].label : '')),
                access1: (e[k].label.length > 0 && e[k].issuer.length > 0) ? e[k].issuer + ":" + e[k].label : (e[k].issuer.length > 0 ? e[k].issuer : (e[k].label.length > 0 ? e[k].label : '')),
                label: e[k].label,
                token: String("totp" == e[k].type ? Ga.totp(e[k]) : '------').replace(/^([\w\-]{3})/, '$1 '),
                type: e[k].type,
                id: k
            });
        }
        return data;
    };
})();