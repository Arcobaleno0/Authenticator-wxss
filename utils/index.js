"use strict";
var url = require("./url.js"),
    Ga = require("./ga.js"),
    parseURL = function(e) {
        var r = url.parse(e, !0),
            t = r.pathname.substr(1).split(":"),
            s = r.query;
        s.encoding = 'base32';
        if (!('hostname' in r)) {
            return !1;
        }
        switch (r.hostname.toLowerCase()) {
            case 'hotp':
            case 'totp':
                break;
            default:
                return !1;
                break;
        }
        if ((!('secret' in s)) || (s.secret.length == 0)) {
            return !1;
        }
        return s.type = r.hostname.toLowerCase(), s.issuer = decodeURIComponent(t[0]), s.label = decodeURIComponent(t.length > 1 ? t[1] : ""), s
    },
    parse_code = function(e) {
        var num = 0;
        return e.map(function(e) {
            return {
                access: e.label.length > 0 ? e.issuer + "(" + e.label + ")" : e.issuer,
                token: String("totp" == e.type ? Ga.totp(e) : Ga.hotp(e)).replace(/^(\d{3})/, '$1 '),
                id: 'canvas' + (num++)
            }
        })
    };
exports.parseURL = parseURL, exports.parse_code = parse_code;