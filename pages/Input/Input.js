var getData = function(k, v) {
    return {
        [k]: v
    };
};
var TOOL = require('../../utils/index.js');
var Config = require('../../utils/Config.js').config;
Page({
    data: {
        usernamefocus: false,
        usernameinput: false,
        tokenerror: false,
        tokenfocus: false,
        tokeninput: false,
        array: ['基于时间'],
        index: 0,
        errorMsg: "密钥值太短",
    },
    Inputfocus: function(e) {
        this.setData(getData(e.target.id + 'focus', true));
    },
    Inputblur: function(e) {
        this.setData(getData(e.target.id + 'focus', false));
    },
    Inputinput: function(e) {
      if (e.target.id == 'token') {
        if (e.detail.value.length > 0 && !(/^[A-Za-z0-7\-\s]+($|=+$)/).test(e.detail.value)) {
                this.setData({
                    errorMsg: '密钥值中含有非法字符'
                });
                this.setData(getData(e.target.id + 'error', true));
            } else {
                this.setData(getData(e.target.id + 'error', false));
            }
        }
        if (e.detail.value.length > 0) {
            this.setData(getData(e.target.id + 'input', true));
        } else {
            this.setData(getData(e.target.id + 'input', false));
        }
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    formSubmit: function(e) {
        var data = e.detail.value;
        if (this.data.tokenerror) {
          return false;
        }
        if (data.token.length < 16 || data.token.replace('\s', '').length < 16) {
            this.setData({
                errorMsg: '密钥值太短'
            });
            this.setData(getData('tokenerror', true));
            return false;
        }
        var obj = {
          "secret": data.token.replace('\s', ''),
          "issuer": data.username,
          "algorithm": "SHA1",
          "digits": "6",
          "period": "30",
          "encoding": "base32",
          "type": ((data.type >> 0) == 0) ? "totp" : 'hotp',
          "label": ""
        }
        Config.update(obj);
        wx.navigateBack();
    }
});