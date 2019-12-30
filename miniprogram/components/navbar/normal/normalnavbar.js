// components/navbar/normal/normalnavbar.js
const app = getApp();
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    titleText: {
      type: String
    },
    bgColor: {
      type: String,
      value: "#FFFFFF"
    },
    textColor: {
      type: String,
      value: "#000000"
    },
    back_show: {//是否显示后退按钮
      type: Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navH: app.globalData.navHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})