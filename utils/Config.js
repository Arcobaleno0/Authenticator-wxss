/*jshint esversion: 6 */
var Config = {
    UUIDv4: function(a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.UUIDv4);
    },
    get: function() {
        var data = (wx.getStorageSync('TOKENS') || {}),
            old_data = (wx.getStorageSync('DATA') || null),
            json = {};
        if (old_data !== null) {
            for (let i in old_data) {
                json[this.UUIDv4()] = {
                    secret: old_data[i].secret,
                    encoding: old_data[i].encoding,
                    algorithm: old_data[i].algorithm,
                    counter: null,
                    issuer: (old_data[i].label.length > 0 ? (old_data[i].issuer.length > 0 ? old_data[i].issuer : '') : ''),
                    type: old_data[i].type,
                    digits: old_data[i].digits,
                    epoch: 0,
                    step: old_data[i].period,
                    label: (old_data[i].label.length > 0 ? old_data[i].label : old_data[i].issuer),
                };
            }
            wx.setStorageSync('TOKENS', json);
            wx.removeStorageSync('DATA');
            return json;
        }
        return data;
    },
    insert: function(value) {
        var data = this.get();
        data[this.UUIDv4()] = value;
        wx.setStorageSync('TOKENS', data);
    },
    del: function(key) {
        var data = this.get();
        delete data[key];
        wx.setStorageSync('TOKENS', data);
    },
    valupdate: function(key, key1, value) {
        var data = this.get();
        data[key][key1] = value;
        wx.setStorageSync('TOKENS', data);
    }
};

exports.config = Config;