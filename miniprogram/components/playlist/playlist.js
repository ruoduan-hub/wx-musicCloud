// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },
  // 数据监听
  observers: {
    ['playlist.playCount'] (count) {
      this.setData({
        _count: this._tranNumber(count, 2)
      })
      this.foo()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 避免监听器 赋值死循环
    _count: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 处理数字到万位数
    _tranNumber (count, point) {
      let countNub = Number(count)
      if (countNub > 1000000) {
        let res = (countNub / 10000).toFixed(point)
        return res + '万'
      } else {
        return count
      }
    },
    async foo () {
      await console.log('foo')
    }

  },
})
