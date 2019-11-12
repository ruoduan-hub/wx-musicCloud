// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化云数据库
const db = cloud.database()
const axios = require("axios")
const URL =  "http://musicapi.xiecheng.live/personalized"

// 云函数入口函数
exports.main = async (event, context) => {
  // 数据库对象
  const playCollection = await db.collection("playlist")

  let data = playCollection.get()
  var list = await axios.get(URL).then(res => {
    return res.data.result
  })

  // 数据去重
  let newDate = [... new Set(
    [
      { a: 1 },
      { b: 2 },
      { a: 1 }
    ]
  )]
  console.log(newDate)
  newDate.map(item => {
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