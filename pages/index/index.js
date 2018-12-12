//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    updateLoading: false,             // 上传的加载状态
    base64Value: "",                  // textarea的输入值
    images: ["/pic/placeholder.svg"]  // 预览的图片
  },
  // 失去焦点时获取textarea的值
  bindTextAreaBlur: function(e) {
    var value = e.detail.value
    this.setData({
      base64Value: value,
    })
  },
  // 点击按钮时得到textarea的值
  getBase64Value: function(e) {
    var value = this.data.base64Value
    if (value == "") {    // 判断是否输入为空
      wx.showLoading({    // 弹出提示框
        title: '请输入Base64',
      })
      setTimeout(function() {
        wx.hideLoading(); // 隐藏提示框
      }, 500)
    } else {
      this.setData({      // 加载base64为图片
        images: [value]
      })
    }
  },
  //  上传图片
  updateImage: function(e) {
    var that = this;
    this.setData({        
      updateLoading: true
    })
    // 选择图片
    wx.chooseImage({
      success: function(res) {                // 成功的回调
        var temp = that
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],     // 选择图片返回的相对路径
          encoding: "base64",                 // 编码格式
          success: res => {                   // 成功的回调
            temp.setData({
              base64Value: "data:image/png;base64," + res.data,
              images: ["data:image/png;base64," + res.data],
              updateLoading: false
            })
          }
        })  
        // wx.setClipboardData({
        //   data: temp.data.base64Value,
        // })
      },
      fail: function() {
        that.setData({
          updateLoading: false                // 失败的回调
        })
      }
    })
  }, 

  // 预览图片
  previewImage: function(e) {
    var value = this.data.base64Value
    var that = this;
    if (value == "") {
      that.updateImage()
    } else {
      wx.previewImage({
        urls: that.data.images,
      })
    }
  }
})
