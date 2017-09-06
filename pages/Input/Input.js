var getData = function(k, v) {
    return {
        [k]: v
    };
};
var TOOL = require('../../utils/index.js');
Page({
    data: {
        usernamefocus: false,
        usernameinput: false,
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
            if (!(/^[A-Za-z0-9]+($|=+$)/).test(e.detail.value)) {
                this.setData({
                    errorMsg: '密钥值中含有非法字符'
                });
                this.setData(getData('tokenerror', true));
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
        if (e.detail.value.token.length < 16) {
            this.setData({
                errorMsg: '密钥值太短'
            });
            this.setData(getData('tokenerror', true));
            return false;
        }
        var data = e.detail.value;
        var obj = {
          "secret": data.token,
          "issuer": data.username,
          "algorithm": "SHA1",
          "digits": "6",
          "period": "30",
          "encoding": "base32",
          "type": ((data.type >> 0) == 0) ? "totp" : 'hotp',
          "label": ""
        }
        var data = wx.getStorageSync('DATA') || [];
        data.push(obj);
        wx.setStorageSync('DATA', data)
        wx.setStorage({
          key:'DATA',
          data:data,
          success:() => {
            wx.navigateBack();
          }
        })
    }
});