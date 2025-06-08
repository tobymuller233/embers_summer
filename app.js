App({
  globalData: {
    userInfo: null,
    backgroundImage: null
  },
  onLaunch() {
    // 初始化数据
    const records = wx.getStorageSync('iceCreamRecords') || []
    this.globalData.records = records
  }
}) 