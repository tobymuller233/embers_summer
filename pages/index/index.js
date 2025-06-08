const store = require('../../utils/store')

Page({
  data: {
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    selectedDate: new Date().toISOString(),
    currentPage: 1,
    monthPages: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    canMoveLeft: true,
    canMoveRight: true,
    backgroundImage: ''
  },

  onLoad: function() {
    try {
      // 设置当前日期，使用本地时区
      const now = new Date()
      const localDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString()
      
      this.setData({
        selectedDate: localDate,
        year: now.getFullYear(),
        month: now.getMonth()
      })
      this.initCalendar()
      
      // 加载背景图片
      const backgroundImage = wx.getStorageSync('backgroundImage')
      if (backgroundImage) {
        this.setData({ backgroundImage })
      }
    } catch (error) {
      console.error('初始化错误:', error)
    }
  },

  onShow: function() {
    try {
      this.initCalendar()
    } catch (error) {
      console.error('显示错误:', error)
    }
  },

  initCalendar: function() {
    try {
      const selectedDate = new Date(this.data.selectedDate)
      const currentDate = new Date()
      const earliestDate = new Date('2003-08-01')
      
      // 计算可以显示的月份（当前月份的前一个月到后三个月）
      const months = []
      let tempDate = new Date(selectedDate)
      tempDate.setMonth(tempDate.getMonth() - 1)
      
      for (let i = 0; i < 5; i++) {
        if (tempDate >= earliestDate) {
          // 创建一个新的日期对象，避免引用问题
          const monthDate = new Date(tempDate.getTime())
          const monthData = {
            date: monthDate.toISOString(),
            days: this.generateMonthData(monthDate)
          }
          months.push(monthData)
        }
        // 使用新的日期对象进行月份递增
        tempDate = new Date(tempDate.getTime())
        tempDate.setMonth(tempDate.getMonth() + 1)
      }

      // 计算是否可以左右滑动
      const lastMonth = new Date(currentDate)
      lastMonth.setMonth(lastMonth.getMonth() + 3)
      const canMoveRight = selectedDate < lastMonth

      // 更新当前页面索引
      const currentPage = months.findIndex(month => {
        const monthDate = new Date(month.date)
        return monthDate.getFullYear() === selectedDate.getFullYear() &&
               monthDate.getMonth() === selectedDate.getMonth()
      })

      this.setData({
        monthPages: months,
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth(),
        canMoveLeft: selectedDate > earliestDate,
        canMoveRight: canMoveRight,
        currentPage: currentPage >= 0 ? currentPage : 1
      })
    } catch (error) {
      console.error('初始化日历错误:', error)
    }
  },

  generateMonthData: function(date) {
    try {
      const year = date.getFullYear()
      const month = date.getMonth()
      
      // 使用本地时间创建日期
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const days = []
      
      // 添加调试信息
    //   console.log('生成月份数据:', {
    //     year: year,
    //     month: month + 1,  // 显示时月份+1
    //     firstDayWeek: firstDay.getDay(),
    //     firstDayDate: firstDay.toISOString()
    //   })
      
      // 填充上个月的日期
      const firstDayWeek = firstDay.getDay()
      for (let i = 0; i < firstDayWeek; i++) {
        const prevMonthLastDay = new Date(year, month, 0)
        const prevMonthDay = prevMonthLastDay.getDate() - firstDayWeek + i + 1
        const prevMonthDate = new Date(year, month - 1, prevMonthDay)
        
        days.push({
          id: `prev-${i}`,
          day: prevMonthDay,
          date: prevMonthDate.toISOString(),
          isToday: false,
          isSelected: false,
          isCurrentMonth: false,
          count: 0
        })
      }
      
      // 填充当前月的日期
      const today = new Date()
      const selectedDate = new Date(this.data.selectedDate)
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i)
        const dateStr = currentDate.toISOString()
        
        const count = store.getCount(dateStr)
        const isToday = this.isSameDay(currentDate, today)
        
        days.push({
          id: dateStr,
          day: i,
          date: dateStr,
          isToday: isToday,
          isSelected: this.isSameDay(currentDate, selectedDate),
          isCurrentMonth: true,
          count: count
        })
      }
      
      // 填充下个月的日期，确保总共有42个格子（6行）
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDate = new Date(year, month + 1, i)
        
        days.push({
          id: `next-${i}`,
          day: i,
          date: nextMonthDate.toISOString(),
          isToday: false,
          isSelected: false,
          isCurrentMonth: false,
          count: 0
        })
      }
      
      return days
    } catch (error) {
      console.error('生成月份数据错误:', error)
      return []
    }
  },

  isSameDay: function(date1, date2) {
    try {
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        return false
      }
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate()
    } catch (error) {
      console.error('日期比较错误:', error)
      return false
    }
  },

  onSwiperChange: function(e) {
    try {
      const currentPage = e.detail.current
      const selectedDate = new Date(this.data.monthPages[currentPage].date)
      
      this.setData({
        selectedDate: selectedDate.toISOString(),
        currentPage: currentPage,
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth()
      })
      
      this.initCalendar()
    } catch (error) {
      console.error('滑动切换错误:', error)
    }
  },

  moveMonth: function(e) {
    try {
      const direction = parseInt(e.currentTarget.dataset.direction)
      const currentDate = new Date(this.data.selectedDate)
      currentDate.setMonth(currentDate.getMonth() + direction)
      
      if (direction < 0 && !this.data.canMoveLeft) return
      if (direction > 0 && !this.data.canMoveRight) return
      
      // 使用本地时区创建日期字符串
      const localDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ).toISOString()
      
      this.setData({
        selectedDate: localDate
      })
      
      this.initCalendar()
    } catch (error) {
      console.error('月份切换错误:', error)
    }
  },

  selectDate: function(e) {
    try {
      const date = e.currentTarget.dataset.date
      if (!date) return
      
      // 确保日期使用本地时区
      const localDate = new Date(date)
      const year = localDate.getFullYear()
      const month = localDate.getMonth()
      const day = localDate.getDate()
      const localDateStr = new Date(year, month, day).toISOString()
      
      this.setData({
        selectedDate: localDateStr
      })
      
      this.initCalendar()
    } catch (error) {
      console.error('选择日期错误:', error)
    }
  },

  navigateToAdd: function() {
    try {
      // 确保使用本地时区的日期
      const localDate = new Date(this.data.selectedDate)
      const year = localDate.getFullYear()
      const month = localDate.getMonth()
      const day = localDate.getDate()
      const localDateStr = new Date(year, month, day).toISOString()
      
      wx.navigateTo({
        url: `/pages/add/add?date=${localDateStr}`
      })
    } catch (error) {
      console.error('导航错误:', error)
    }
  },

  showResetConfirm: function() {
    try {
      wx.showModal({
        title: '确认重置',
        content: '确定要重置所有记录吗？此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            store.resetAll()
            this.initCalendar()
          }
        }
      })
    } catch (error) {
      console.error('重置确认错误:', error)
    }
  },

  chooseImage: function() {
    try {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.setData({
            backgroundImage: tempFilePath
          })
          wx.setStorageSync('backgroundImage', tempFilePath)
        }
      })
    } catch (error) {
      console.error('选择图片错误:', error)
    }
  }
}) 