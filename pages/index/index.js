//index.js
//获取应用实例
const app = getApp()
var TOOL = require('../../utils/index.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    DATA: TOOL.parse_code(wx.getStorageSync('DATA') || []),
    timeOut: 30
  },
  showCode: function(reload){
    reload = reload || false;
    var sec = new Date().getSeconds();
    var secsToNext = 30;
    if ((sec == 0) || (sec == 30) || reload) {
      this.setData({
        DATA: TOOL.parse_code(wx.getStorageSync('DATA') || []),
        timeOut: secsToNext
      });
    } else {
      if (sec < 30) {
        secsToNext = 30 - sec;
      } else if (sec > 30) {
        secsToNext = 60 - sec;
      }
      this.setData({
        timeOut: secsToNext
      });
    }
  },
  onShow: function () {
    this.showCode(true);
  },
  Longpress:function(){
    console.log(1)
  },
  onReady: function (e) {
    setInterval(() => {
      this.showCode();
    }, 500);
  },
  showWidget: function () {
    wx.showActionSheet({
      itemList: ['扫描二维码', '输入提供的密钥'],
      success: (res) => {
        if (!res.cancel) {
          switch (res.tapIndex) {
            case 0:
              // 允许从相机和相册扫码
              wx.scanCode({
                success: (res) => {
                  var d = TOOL.parseURL(res.result);
                  if (d === false) {
                    return wx.showModal({
                      content: '无法解读 QR 码',
                      showCancel: false,
                    });
                  }
                  var data = wx.getStorageSync('DATA') || [];
                  data.push(d);
                  this.setData({
                    DATA: TOOL.parse_code(data)
                  });
                  wx.setStorageSync('DATA', data);
                  this.showCode(true);
                }
              });
              break;
            case 1:
              wx.navigateTo({
                url: '../Input/Input',
              });
              break;
          }
        }
      }
    });
  }
})