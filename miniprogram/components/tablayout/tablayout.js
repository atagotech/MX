Component({
  /**
   * 组件的属性列表
   */
  properties: {
      titles:{
        type:Array,
        value:[],
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //屏幕宽度 
    screenWidth: "",
    //微信规定的屏幕宽度750 rpx
    wxScreenWidth: 750,
    //指示器滑动范围宽度，单位宽度
    indicatorLayoutWidth: 100,
    //标题 swiper-item 所在位置
    titleIndex: 0,
    //滑动状态：滑动到左边(1)、滑动到右边(2)、其他位置(0)
    scrollStatus: 1,
    animation: "",
  },

  /**
   * 组件的方法列表
   */

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  

  lifetimes: {
    attached() {
      // 获取屏幕宽度
      var that = this;
      that.setData({ screenWidth: wx.getSystemInfoSync().screenWidth });
    }
  },

  methods:{
    swiperTrans: function (e) {
      var that = this;
      // swipter位移 中间变量
      var dx;

      //e.detail.dx 页面滑动距离，手指向左滑动距离为正，反之为负
      if (e.detail.dx >= 0)
        if (that.data.scrollStatus == 2)//页面处于最右，且仍向左滑动时，页面位置保持在最右。
          dx = that.data.screenWidth * that.data.titleIndex;
        else
          dx = e.detail.dx + that.data.screenWidth * that.data.titleIndex;
      else if (that.data.scrollStatus == 1) //页面在初始位置，且仍向右滑动时，页面停留在初始位置。
        dx = 0
      else
        dx = e.detail.dx + that.data.screenWidth * that.data.titleIndex;

      //indicator与swipter之间移动比例
      var scale = (that.data.indicatorLayoutWidth / that.data.wxScreenWidth).toFixed(2);
      //保留两位小数，否则indicator动画有误差
      //indicator 位移
      var ds = dx * scale;

      this.transIndicator(ds);
    },

    //indicator 平移动画
    transIndicator(x) {
      let option = {
        duration: 100,
        timingFunction: 'linear'
      };
      this.animation = wx.createAnimation(option);
      this.animation.translateX(x).step();
      this.setData({
        animation: this.animation.export()
      })
    },
      clickTitle(e) {
      //点击切换卡片
      var that = this;
      that.setData({
        //swiper 绑定了 current="{{swiperIndex}}"
        swiperIndex: e.currentTarget.dataset.index
      });
    },


    swiperAnimationfinish: function (e) {
      var that = this;
      that.setData({
        titleIndex: e.detail.current
      });

      //计算指示器位移状态
      if (that.data.titleIndex == (that.data.titles.length - 1)) {
        // console.log("move to the right")
        that.setData({ scrollStatus: 2 });
      } else if (that.data.titleIndex == 0) {
        // console.log("move to the left")
        that.setData({ scrollStatus: 1 });
      } else {
        that.setData({ scrollStatus: 0 });
      }
    },


  },
  



})
