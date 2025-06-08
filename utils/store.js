const STORAGE_KEY = 'iceCreamRecords'

class IceCreamStore {
  constructor() {
    this.records = wx.getStorageSync('iceCreamRecords') || []
  }

  save() {
    wx.setStorageSync('iceCreamRecords', this.records)
  }

  addRecord(date, count) {
    const record = this.records.find(r => this.isSameDay(new Date(r.date), new Date(date)))
    if (record) {
      record.count = count
    } else {
      this.records.push({
        date: new Date(date).toISOString(),
        count: count
      })
    }
    this.save()
  }

  getCount(date) {
    const record = this.records.find(r => this.isSameDay(new Date(r.date), new Date(date)))
    return record ? record.count : 0
  }

  resetAll() {
    this.records = []
    this.save()
  }

  isSameDay(date1, date2) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      return false
    }
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}

module.exports = new IceCreamStore() 