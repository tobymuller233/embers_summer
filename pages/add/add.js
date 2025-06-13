const store = require('../../utils/store')

Page({
  data: {
    date: '',
    displayDate: '',
    coneCount: 0,
    cupCount: 0,
    tempConeCount: 0,  // 临时存储甜筒数量
    tempCupCount: 0    // 临时存储杯装数量
  },

  onLoad: function(options) {
    try {
      const date = options.date || new Date().toISOString()
      const displayDate = this.formatDisplayDate(new Date(date))
      const dateStr = this.formatDate(new Date(date))
      const iceCreamData = wx.getStorageSync('iceCreamData') || {}
      const dayData = iceCreamData[dateStr] || []
      
      let coneCount = 0
      let cupCount = 0
      
      dayData.forEach(item => {
        if (item.type === 'cone') {
          coneCount = item.count
        } else if (item.type === 'cup') {
          cupCount = item.count
        }
      })
      
      this.setData({
        date: date,
        displayDate: displayDate,
        coneCount: coneCount,
        cupCount: cupCount,
        tempConeCount: coneCount,
        tempCupCount: cupCount
      })
    } catch (error) {
      console.error('页面加载错误:', error)
    }
  },

  formatDate: function(date) {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error('日期格式化错误:', error)
      return ''
    }
  },

  // 用于显示的日期格式化
  formatDisplayDate: function(date) {
    try {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}年${month}月${day}日`
    } catch (error) {
      console.error('日期格式化错误:', error)
      return ''
    }
  },

  addCone: function() {
    try {
      this.setData({
        tempConeCount: this.data.tempConeCount + 1
      })
    } catch (error) {
      console.error('添加甜筒错误:', error)
    }
  },

  addCup: function() {
    try {
      this.setData({
        tempCupCount: this.data.tempCupCount + 1
      })
    } catch (error) {
      console.error('添加杯装错误:', error)
    }
  },

  confirmChanges: function() {
    try {
      // 保存冰淇淋数据
      const dateStr = this.formatDate(new Date(this.data.date))
      const iceCreamData = wx.getStorageSync('iceCreamData') || {}
      
      if (this.data.tempConeCount > 0) {
        if (!iceCreamData[dateStr]) {
          iceCreamData[dateStr] = []
        }
        const coneIndex = iceCreamData[dateStr].findIndex(item => item.type === 'cone')
        if (coneIndex !== -1) {
          iceCreamData[dateStr][coneIndex].count += this.data.tempConeCount
        } else {
          iceCreamData[dateStr].push({
            type: 'cone',
            count: this.data.tempConeCount
          })
        }
      }
      
      if (this.data.tempCupCount > 0) {
        if (!iceCreamData[dateStr]) {
          iceCreamData[dateStr] = []
        }
        const cupIndex = iceCreamData[dateStr].findIndex(item => item.type === 'cup')
        if (cupIndex !== -1) {
          iceCreamData[dateStr][cupIndex].count += this.data.tempCupCount
        } else {
          iceCreamData[dateStr].push({
            type: 'cup',
            count: this.data.tempCupCount
          })
        }
      }
      
      wx.setStorageSync('iceCreamData', iceCreamData)
      
      // 保存当前选中的日期，确保返回时保持在同一日期
      wx.setStorageSync('selectedDate', this.data.date)
      
      wx.navigateBack()
    } catch (error) {
      console.error('确认更改错误:', error)
    }
  },

  resetCount: function() {
    try {
      wx.showModal({
        title: '确认重置',
        content: '确定要重置今天的记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              tempConeCount: 0,
              tempCupCount: 0
            })
          }
        }
      })
    } catch (error) {
      console.error('重置错误:', error)
    }
  }
}) 