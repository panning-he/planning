"use strict";
var util = require("../../utils/util.js");
var calendar = require("../../utils/calendar.js");
var time = util.formatTimeYMD(new Date());
var timeShow = '今日目标';
var app = getApp();
const date = new Date();
Page({
  data: {
    dialogShow: false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: time,
    dateShow: timeShow,
    // 此处为日历自定义配置字段
    calendarConfig: {
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 初始化时不默认选中当天，则将该值配置为false。
       */
      multi: false, // 是否开启多选,
      theme: 'blue', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: false, // 单选模式下是否支持取消选中,
      chooseAreaMode: false, // 开启日期范围选择模式，该模式下只可选择时间段
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: true, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      preventSwipe: false, // 是否禁用日历滑动切换月份
      disablePastDay: false, // 是否禁选当天之前的日期
      disableLaterDay: false, // 是否禁选当天之后的日期
      firstDayOfWeek: 'Sun', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    },
  },
  swipeCheckX: 35, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 185, //消息列表项最大左滑距离
  correctMoveLeft: 76, //显示菜单时的左滑距离
  thresholdMoveLeft: 75, //左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0, //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onLoad: function() {
    var _this = this;
    this.setData({
      slideButtons: [{
        text: '普通',
        src: '/page/weui/cell/icon_love.svg', // icon的路径
      }, {
        text: '普通',
        extClass: 'test',
        src: '/page/weui/cell/icon_star.svg', // icon的路径
      }, {
        type: 'warn',
        text: '警示',
        extClass: 'test',
        src: '/page/weui/cell/icon_del.svg', // icon的路径
      }],
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = function(res) {
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      wx.getUserInfo({
        success: function(res) {
          app.globalData.userInfo = res.userInfo;
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch: weeks_ch,
    });
  },
  onReady: function(e) {
    this.calculateEmptyGrids(2020, 1, '')
    this.calculateDays(2020, 1, '')
    console.log(new Date(Date.UTC(2020, 0, 5)).getDay())
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
  getThisMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek: function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids: function(year, month) {
    var that = this;
    that.setData({
      days: []
    });
    var firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (var i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false
        };
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days
      });
    } else {
      this.setData({
        days: []
      });
    }
  },
  calculateDays: function(year, month, sign) {
    var that = this;
    var isSign;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (var i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: ''
      }
      /*for (var j = 0; j < sign.length; j++) {
          if (i == parseInt(sign[j].create_time.substr(8, 2))) {
              obj.isSign = true;
              break;
          }
      }*/
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });
  },
  handleCalendar: function(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.signRecord(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        imgType: 'cnext.png'
      })
    } else {
      if (cur_month + 1 > month) {
        this.setData({
          imgType: 'next.png'
        })
      } else {
        let newMonth = cur_month + 1;
        let newYear = cur_year;
        if (newMonth > 12) {
          newYear = cur_year + 1;
          newMonth = 1;
        }
        this.signRecord(newYear, newMonth);
        if (cur_month + 1 == month) {
          this.setData({
            cur_year: newYear,
            cur_month: newMonth,
            imgType: 'next.png'
          })
        } else {
          this.setData({
            cur_year: newYear,
            cur_month: newMonth,
            imgType: 'cnext.png'
          })
        }
      }
    }
  },

  ontouchstart: function(e) {
    if (this.showState === 1) {
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
      return;
    }
    this.firstTouchX = e.touches[0].clientX;
    this.firstTouchY = e.touches[0].clientY;
    if (this.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1;
    }
    this.lastMoveTime = e.timeStamp;
  },
  addGoal: function(e) {
    this.setData({
      dialogShow: true
    })
  }
});