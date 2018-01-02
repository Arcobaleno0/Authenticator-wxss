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
        data[Object.keys(data).length] = value;
        wx.setStorageSync('DATA', data);
    },
    del: function(key) {
        var data = this.get();
        delete data[key];
        wx.setStorageSync('DATA', data);
    },
    valupdate: function(key, key1, value) {
      var data = this.get();
      data[key][key1] = value;
      wx.setStorageSync('DATA', data);
    }
};

exports.config = Config;