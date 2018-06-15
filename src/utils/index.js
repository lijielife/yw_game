function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function changeNum (num) {
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chnUnitChar = '十'
  let str = ''
  if (parseInt(num) <= 10) {
    str = chnNumChar[parseInt(num)]
  } else {
    str = chnNumChar[parseInt(parseInt(num) / 10)] + chnUnitChar + chnNumChar[parseInt(num) % 10]
  }
  return str
}

export function goToPage (page) {
  let url = `../${page}/main`
  wx.navigateTo({url: url})
}

export function isInArray (arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}
