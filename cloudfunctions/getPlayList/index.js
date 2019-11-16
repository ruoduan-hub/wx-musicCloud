// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化云数据库
const db = cloud.database()
const axios = require("axios")
const URL =  "http://musicapi.xiecheng.live/personalized"

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // 数据库对象
  const playCollection = await db.collection("playlist")
  // 数据库集合总数
  const countResult = await db.collection('playlist').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('playlist').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  let data = {
    data: []
  }
  // 组合数据
  if (tasks.length > 0) {
    (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      }
    })
  }

  // 储存去重后的数据
  let newData = []
  let list = await axios.get(URL).then(res => {
    return res.data.result
  })

  if (!data) {
    // 数据去重
    data.forEach((d) => {
      list.forEach(l => {
        if (!d.id === l.id) {
          newData.push(l)
        }
      })
    })
  } else {
    newData = list
  }

  // 逐条添加数据
  newData.map(item => {
    playCollection.add({
      data: {
        item,
        createTime: db.serverDate()
      }
    })
    .then(res => {
      console.log("成功")
    })
    .catch(err => {
      console.log("失败")
    })
  })
}