/*jshint esversion: 6 */
//获取应用实例
var TOOL = require('../../utils/index.js'),
    Config = require('../../utils/Config.js').config,
    Ga = require("../../utils/Gauth.js"),
    Interval,
    TEMP_TOKENS = Config.get();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        DATA: {},
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
        if (reload) {
            TEMP_TOKENS = Config.get();
        }
        if (TEMP_TOKENS.length === 0) {
            return false;
        }
        let data = {};
        for (let id in TEMP_TOKENS) {
            let over = (TEMP_TOKENS[id].step - ((Date.now() / 1000 >> 0) % TEMP_TOKENS[id].step));
            data[id] = {
                id: id,
                issuer: TEMP_TOKENS[id].issuer,
                access: (TEMP_TOKENS[id].label.length > 0 && TEMP_TOKENS[id].issuer.length > 0) ? (TEMP_TOKENS[id].issuer + " (" + TEMP_TOKENS[id].label + ")") : TEMP_TOKENS[id].label,
                access1: (TEMP_TOKENS[id].label.length > 0 && TEMP_TOKENS[id].issuer.length > 0) ? (TEMP_TOKENS[id].issuer + ":" + TEMP_TOKENS[id].label) : TEMP_TOKENS[id].label,
                label: TEMP_TOKENS[id].label,
                token: ((over === TEMP_TOKENS[id].step) || (!(id in this.data.DATA)) || reload) ? String((("totp" == TEMP_TOKENS[id].type) ? Ga.totp(TEMP_TOKENS[id]) : '------')).replace(/^([\w\-]{3})/, '$1 ') : this.data.DATA[id].token,
                type: TEMP_TOKENS[id].type,
                timer: ("totp" == TEMP_TOKENS[id].type) ? over : 0
            };
        }
        this.setData({
            DATA: data
        });
    },
    runCron: function() {
        return Interval || (Interval = setInterval(() => {
            this.showCode();
        }, 500));
    },
    stopCron: function() {
        return Interval && clearInterval(Interval), (Interval = undefined);
    },
    onShow: function() {
        this.showCode(true);
        this.runCron();
    },
    onHide: function() {
        this.stopCron();
    },
    onUnload: function() {
        this.stopCron();
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
                Config.insert(d);
                TEMP_TOKENS = Config.get();
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
            data: event.currentTarget.dataset.token.replace(/\s/ig, ''),
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