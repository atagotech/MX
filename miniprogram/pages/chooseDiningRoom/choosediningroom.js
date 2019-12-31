// miniprogram/pages/chooseDiningRoom/choosediningroom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNeedBack: true,
    tabs: ['常规餐厅', '甜品站'],

    tab_in_width: 0, //指示器的长度
    tab_in_offset: 0, //指示器的偏移量

    tab_in_f_offset: 0, //指向第一个teb的偏移量
    tab_in_s_width: 0,
    tab_in_s_offset: 0, //指向第二个的偏移量
    tab_in_anim_start: false,
    tab_in_anim: {}
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
    console.log("onReady")
    this.measureTabInWidth()
  },

  measureTabInWidth: function() {
    var query = wx.createSelectorQuery();
    var tmpWidth = 0;
    var that = this;
    query.select('#firsttab').boundingClientRect()
    query.exec(function(res) {
      console.log(res);
      console.log(res[0].width)
      tmpWidth = res[0].width
      that.setData({
        tab_in_width: tmpWidth / 2,
        tab_in_f_offset: tmpWidth / 4 + res[0].left,
        tab_in_offset: tmpWidth / 4 + res[0].left, //初始在第一个
      })
    })
    var query2 = wx.createSelectorQuery();
    query2.select('#secondtab').boundingClientRect()
    query2.exec(function(res) {
      console.log(res);
      console.log(res[0].width)
      tmpWidth = res[0].width
      that.setData({
        tab_in_s_width: tmpWidth / 2,
        tab_in_s_offset: res[0].left + tmpWidth / 5
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow")
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

  /**
   * 切换tab
   * 
   */
  switchTab: function(e) {
    console.log("switchTab")
    let index = e.currentTarget.dataset['index']
    this.startTabInAnimation(index)
  },
  startTabInAnimation: function(index) {

    console.log("startTabInAnimation")
    var that = this;
    var animation = wx.createAnimation({
      duation: 3000,
      timingFunction: 'linear'
    });
    console.log(index)
    if (index == 1) { //从左往右
      animation.translateX(that.data.tab_in_s_offset - that.data.tab_in_f_offset).step()
    } else if (index == 0) { //从右往左
      animation.translateX(0).step()
    }

    that.setData({
      tab_in_anim: animation.export(),
      tab_in_anim_start: true
    })
  }
})