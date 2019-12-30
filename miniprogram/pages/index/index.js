//index.js
const app = getApp();
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgquestion: "../img",
    background: [],//轮播图
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    push_left: "",//推荐左图
    push_right: "",//推荐右图
    isNeedBack:false//是否带返回按钮
  },
  onLoad: function() {
    console.log("onload")
    this.setData({
      navH: app.globalData.navHeight,
      autoplay: !this.data.autoplay
    })
    this.imgQuery()
    if (!wx.cloud) {

      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },


  /**
   * 查询云图片
   */
  imgQuery: function() {
    console.log("imgquery")
    let that = this;
    let imgArr = [];
    let left_push = "";
    let right_push = "";
    db.collection('images').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        console.log(res);
        let dataList = res.data;
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].type == "1") {
            imgArr.push(dataList[i].url)
          } else if (dataList[i].type == "2") {
            left_push = dataList[i].url;
          } else if (dataList[i].type == "3") {
            right_push = dataList[i].url;
          }
        }

        this.setData({
          background: imgArr,
          push_left: left_push,
          push_right:right_push
        })
        console.log("[数据库][查询记录]成功：", res)
      },
      fail: err => {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        })
        console.log("[数据库][查询记录]失败：", err)
      }
    })
  },

  goOrder:function(){
    wx.navigateTo({
      url: '../chooseDiningRoom/choosediningroom',
    })
  }

})