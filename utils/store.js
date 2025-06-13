const STORAGE_KEY = 'ice_cream_records'

const store = {
  // 获取指定日期的冰淇淋数量
  getCount: function(date) {
    try {
      const records = wx.getStorageSync(STORAGE_KEY) || {}
      const record = records[date] || { cone: 0, cup: 0 }
      return record
    } catch (error) {
      console.error('获取记录错误:', error)
      return { cone: 0, cup: 0 }
    }
  },

  // 增加指定日期的冰淇淋数量
  addCount: function(date, type) {
    try {
      const records = wx.getStorageSync(STORAGE_KEY) || {}
      if (!records[date]) {
        records[date] = { cone: 0, cup: 0 }
      }
      records[date][type]++
      wx.setStorageSync(STORAGE_KEY, records)
    } catch (error) {
      console.error('添加记录错误:', error)
    }
  },

  // 重置指定日期的冰淇淋数量
  resetCount: function(date) {
    try {
      const records = wx.getStorageSync(STORAGE_KEY) || {}
      records[date] = { cone: 0, cup: 0 }
      wx.setStorageSync(STORAGE_KEY, records)
    } catch (error) {
      console.error('重置记录错误:', error)
    }
  },

  // 重置所有记录
  resetAll: function() {
    try {
      wx.setStorageSync(STORAGE_KEY, {})
    } catch (error) {
      console.error('重置所有记录错误:', error)
    }
  }
}

module.exports = store 