//index.js
//获取应用实例
const app = getApp()
var TOOL = require('../../utils/index.js');
var canvas = (ctx) => {
    var sector = (ctx, x, y, r, angle1, angle2) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, r, angle1 * Math.PI / 180, angle2 * Math.PI / 180, false);
        ctx.closePath();
        return ctx;
    };
    var time_over = (ctx) => {
        // Get current time seconds
        var sec = new Date().getSeconds();
        var secsToNext = 0;
        // If less than 30, next update is at 30
        if (sec < 30) {
            secsToNext = 30 - sec;
        } else if (sec > 30) {
            secsToNext = 60 - sec;
        }
        var angle = -90 + (360 - (secsToNext * 12));
        ctx.setFillStyle('#4285f4');
        sector(ctx, 8, 8, 8, angle, 270).fill();
        ctx.draw();
        var timer = setInterval(() => {
            angle += 6;
            ctx.setFillStyle('#4285f4');
            sector(ctx, 8, 8, 8, angle, 270).fill();
            ctx.draw();
            if (angle >= 270) {
                clearInterval(timer);
                time_over(ctx);
            }
        }, 500);
    };
    time_over(ctx);
};
Page({
    /**
     * 页面的初始数据
     */
    data: {
        DATA: TOOL.parse_code(wx.getStorageSync('DATA') || [])
    },
    canvasIdErrorCallback: function(e) {
        console.error(e.detail.errMsg)
    },
    onReady: function(e) {
        TOOL.parse_code(wx.getStorageSync('DATA') || []).forEach((item) => {
            canvas(wx.createCanvasContext(item.id));
        });
        setInterval(() => {
            var sec = new Date().getSeconds();
            if (sec == 0 || sec == 30) {
                this.setData({
                    DATA: TOOL.parse_code(wx.getStorageSync('DATA') || [])
                });
            }
        }, 500);
    },
    showWidget: function() {
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
                                    canvas(wx.createCanvasContext('canvas' + (data.length - 1)));
                                    wx.setStorageSync('DATA', data);
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