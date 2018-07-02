/*jshint esversion: 6 */
//获取应用实例
var TOOL = require('../../utils/index.js');
var Config = require('../../utils/Config.js').config;
var Interval = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        DATA: TOOL.parse_code(Config.get()),
        timeOut: 30,
        DeleteModal: true,
        deleteinfo: '',
        deleteid: null,
        rename: '',
        reid: 0,
        RenameModal: true
    },
    showCode: function(reload) {
        reload = reload || false;
        var sec = new Date().getSeconds();
        var secsToNext = (sec >= 30) ? 60 - sec : 30 - sec;
        if ((sec === 0) || (sec == 30) || reload) {
            this.setData({
                DATA: TOOL.parse_code(Config.get()),
                timeOut: secsToNext
            });
        } else {
            this.setData({
                timeOut: secsToNext
            });
        }
    },
    onShow: function() {
        this.showCode(true);
        this.onReady();
    },
    onHide: function() {
        return Interval && clearInterval(Interval);
    },
    onReady: function(e) {
        Interval = setInterval(() => {
            this.showCode();
        }, 500);
    },
    showWidget: function() {
        wx.showActionSheet({
            itemList: ['扫描二维码', '输入提供的密钥', '设置面板'],
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
                                    Config.update(d);
                                    this.setData({
                                        DATA: TOOL.parse_code(Config.get())
                                    });
                                    this.showCode(true);
                                }
                            });
                            break;
                        case 1:
                            wx.navigateTo({
                                url: '/pages/input/input',
                            });
                            break;
                        case 2:
                            wx.navigateTo({
                                url: '/pages/setting/setting',
                            });
                            break;
                    }
                }
            }
        });
    },
    Longpress: function(event) {
        wx.setClipboardData({
            data: event.currentTarget.dataset.token.replace(/\s/, ''),
            success: (res) => {
                wx.showToast({
                    title: '验证码已复制',
                    icon: 'none',
                    duration: 1000
                });
            }
        });
        wx.showActionSheet({
            itemList: ['修改', '删除'],
            success: (res) => {
                if (!res.cancel) {
                    switch (res.tapIndex) {
                        case 0:
                            this.setData({
                                reid: event.currentTarget.dataset.id,
                                rename: event.currentTarget.dataset.label,
                                RenameModal: false
                            });
                            break;
                        case 1:
                            this.setData({
                                deleteid: event.currentTarget.dataset.id,
                                deleteinfo: event.currentTarget.dataset.access,
                                DeleteModal: false
                            });
                            break;
                    }
                }
            }
        });
    },
    modalChange: function() {
        this.setData({
            DeleteModal: true
        });
    },
    modalre: function() {
        this.setData({
            RenameModal: true
        });
    },
    modalDelete: function() {
        Config.del(this.data.deleteid);
        this.setData({
            DeleteModal: true
        });
        this.showCode(true);
    },
    modalreChange: function(event) {
        Config.valupdate(this.data.reid, 'label', this.data.rename);
        this.showCode(true);
        this.setData({
            RenameModal: true
        });
    },
    userNameInput: function(e) {
        this.setData({
            rename: e.detail.value
        });
    },
    getHotp: function(event) {
        console.log(this.data);
        console.log(event);
    }
});