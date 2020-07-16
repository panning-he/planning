// miniprogram/pages/index/month.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: new Date().getMonth(),
    show: false,
    buttons: [{
        type: 'default',
        className: '',
        text: '取消',
        value: 0
      },
      {
        type: 'primary',
        className: '',
        text: '确定',
        value: 1
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  handleTap: function(e) {
    this.setData({
      num: e.target.dataset.num
    })
  },
  addGoal: function() {
    this.setData({
      show: true
    })
  },
})