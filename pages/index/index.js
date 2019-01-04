//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    updateLoading: false,             // 上传的加载状态
    base64Value: "",                  // textarea的输入值
    images: ["/pic/placeholder.svg"]  // 预览的图片
  },

  // 从剪贴板获取数据
  getDataFromClipBoard: function () {
    // 自动将剪贴板内容转换为base64图片
    var that = this;
    wx.getClipboardData({
      success: function (res) {
        var clipBoardData = res.data;
        // 判断剪贴板内容是否包含base64前缀
        if (that.isBase64(clipBoardData)) {
          that.setData({
            base64Value: clipBoardData,
            images: [clipBoardData]
          });
        } else {
          that.toast("剪贴板中未检测到base");
        }
      }
    })
  },

  copyData: function () {
    var value = this.data.base64Value;
    if (value == '') {
      this.toast("复制失败");      
    } else {
      wx.setClipboardData({
        data: value,
      })
    }
  },

  clipData: function () {
    this.getDataFromClipBoard()
  },

  transBase64: function () {
    var value = this.data.base64Value;
    if (value == "") {    // 判断是否输入为空
      this.toast("请输入Base64");
    } else {
      this.setData({      // 加载base64为图片
        base64Value: value,
        images: [value]
      })
    }
  },

  clearData: function () {
    this.setData({
      base64Value: "",
      images: ["/pic/placeholder.svg"]
    })
  },

  // 失去焦点时获取textarea的值
  bindTextAreaBlur: function(e) {
    var value = e.detail.value
    this.setData({
      base64Value: value,
    })
  },

  //  上传图片
  uploadImage: function(e) {
    var that = this;
    // 选择图片
    wx.chooseImage({
      success: function(res) {                // 成功的回调
        var temp = that
        temp.setData({
          updateLoading: true
        }),
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],     // 选择图片返回的相对路径
          encoding: "base64",                 // 编码格式
          success: res => {                   // 成功的回调
            var result = "data:image/png;base64," + res.data;
            temp.setData({
              base64Value: result,
              images: [result],
              updateLoading: false
            });
          }
        })  
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
    if (value == "") {
      this.uploadImage()
    } else {
      wx.previewImage({
        urls: this.data.images,
      })
    }
  },

  // 显示toast
  toast: function(value) {
    wx.showToast({
      title: value,
      icon: "none",
      duration: 1000,
    })
  },
  
  // 是否包含base64前缀
  isBase64: function (value) {
    if (value.indexOf("data:image/png;base64,") > -1) {
      return true;
    } else {
      return false;
    }
  }
})
