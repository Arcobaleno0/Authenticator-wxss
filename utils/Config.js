var Config = {
    get: function() {
        var data = (wx.getStorageSync('DATA') || []),
            json = {};
        if (Array.isArray(data)) {
            data.forEach((item, k) => {
                json[k] = item;
            });
            return json;
        }
        return data;
    },
    update: function(value) {
        var data = this.get();
        var lastkey = Object.values(data).length;
        data[lastkey] = value;
        wx.setStorageSync('DATA', data);
    },
    del: function(key) {
        var data = this.get();
        delete data[key];
        wx.setStorageSync('DATA', data);
    }
};

exports.config = Config;