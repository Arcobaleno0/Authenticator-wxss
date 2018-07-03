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
        ErrorModal: true,
        RenameModal: true,
        Panel: true,
        deleteinfo: '',
        deleteid: null,
        rename: '',
        reid: 0,
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
        return this.setData({
            Panel: false,
        });
    },
    openScan: function() {
        this.setData({
            Panel: true,
        });
        // 允许从相机和相册扫码
        wx.scanCode({
            success: (res) => {
                var d = TOOL.parseURL(res.result);
                if (d === false) {
                    return this.setData({
                        ErrorModal: false,
                    });
                }
                Config.update(d);
                this.setData({
                    DATA: TOOL.parse_code(Config.get())
                });
                this.showCode(true);
            }
        });
    },
    gotoInput: function() {
        this.setData({
            Panel: true,
        });
        wx.navigateTo({
            url: '/pages/input/input',
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
    ErrorTap: function() {
        this.setData({
            ErrorModal: true
        });
    },
    PanelTap: function() {
        this.setData({
            Panel: true
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
    },
    catchtouchmove: function() {
        return false;
    }
});