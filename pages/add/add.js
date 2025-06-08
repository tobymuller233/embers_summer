const store = require('../../utils/store')

Page({
  data: {
    date: '',
    count: 0,
    year: 0,
    month: 0,
    day: 0
  },

  onLoad: function(options) {
    try {
      if (options.date) {
        // 使用本地时区处理日期
        const date = new Date(options.date)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        
        // 获取当前记录数
        const count = store.getCount(options.date)
        
        this.setData({
          date: options.date,
          count: count,
          year: year,
          month: month,
          day: day
        })
      }
    } catch (error) {
      console.error('加载错误:', error)
    }
  },

  onCountChange: function(e) {
    try {
      this.setData({
        count: parseInt(e.detail.value) || 0
      })
    } catch (error) {
      console.error('数量变更错误:', error)
    }
  },

  onAdd: function() {
    try {
      // 获取当前输入框的值
      const inputValue = parseInt(this.data.count) || 0
      // 获取原有记录数
      const currentCount = store.getCount(this.data.date) || 0
      // 计算新的总数
      const newCount = currentCount + inputValue
      
      // 保存新的总数
      store.addRecord(this.data.date, newCount)
      this.setData({
        count: newCount
      })
      
      // 添加成功后返回上一页
      wx.navigateBack()
    } catch (error) {
      console.error('添加错误:', error)
    }
  },

  onSet: function() {
    try {
      // 直接设置新的数量
      store.addRecord(this.data.date, this.data.count)
      wx.navigateBack()
    } catch (error) {
      console.error('设置错误:', error)
    }
  }
}) 