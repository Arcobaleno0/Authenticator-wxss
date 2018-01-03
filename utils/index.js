"use strict";
var url = require("./url.js"),
  Ga = require("./Gauth.js"),
  parseURL = function (e) {
    var r = url.parse(e, !0),
      t = r.pathname.substr(1).split(":"),
      s = r.query,
      obj = {
        "secret": "",
        "issuer": "",
        "algorithm": "SHA1",
        "digits": "6",
        "period": "30",
        "encoding": "base32",
        "type": "totp",
        "label": ""
      }
    s = Object.assign(obj, s);
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
  parse_code = function (e) {
    var data = [];
    for (let k in e ){
      data.push({
        issuer: e[k].issuer,
        access: e[k].label.length > 0 ? e[k].issuer + " (" + e[k].label + ")" : e[k].issuer,
        token: String("totp" == e[k].type ? Ga.totp(e[k]) : '------').replace(/^([\w\-]{3})/, '$1 '),
        type: e[k].type,
        id: k
      });
    }
    return data;
  };
exports.parseURL = parseURL, exports.parse_code = parse_code;