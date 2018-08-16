import {baseUrl} from './baseUrl'
import {request} from './wx'
//
/**
 * @param  { String } js_code
 * 获取微信openid
 */
export async function wxMsg (param) {
  const res = await request({
    url: `${baseUrl}/teacherContro/wxMsg`,
    data: param
  })
  return res
}

// 游客金币
export async function checkYoukeGoldCoin (param) {
  const res = await request({
    url: `${baseUrl}/studentContro/checkYoukeGoldCoin`,
    data: param
  })
  return res
}

/**
 * @param  { String } openid 微信openid
 * 检查用户是否注册
 */
export async function checkUser (param) {
  const res = await request({
    url: `${baseUrl}/studentContro/checkLogin`,
    data: param
  })
  return res
}

/**
 * @param  { String } openid 微信openid
 * 获取短信验证码
 */
export async function getCode (param) {
  const res = await request({
    url: `${baseUrl}/studentContro/checkMobile`,
    data: param
  })
  return res
}

/**
 * @param  { String } phoneNumber 手机号码
 * @param  { String } code 手机验证码
 * @param  { String } wxMsgJson 微信个人信息
 * wxMsgJson --- JSON.stringify({"openid":"openidvalue","nickname":"nkvalue","avatarUrl":"urlvalue"})
 * 学生注册登录
 */
export async function stuLogin (param) {
  const res = await request({
    url: `${baseUrl}/studentContro/stuLogin`,
    data: param
  })
  return res
}

/**
 * @param  wxMsgJson --- JSON.stringify({"openid":"openidvalue","nickname":"nkvalue","avatarUrl":"urlvalue"})
 * 游客注册登录
 */
export async function visitLogin (param) {
  const res = await request({
    url: `${baseUrl}/studentContro/youkeLogin`,
    data: param
  })
  return res
}

// 获取用户数据
export async function getUserData (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/stuMainPage`,
    data: data
  })
  return res
}

// 年级维度排行榜
export async function stuRanking (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/stuRanking`,
    data: data
  })
  return res
}

// 个人关卡信息
export async function getUserCheckPoints (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/getUserCheckPoints`,
    data: data
  })
  return res
}

// 获取关卡题目
export async function getAccessPassSubject (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/getAccessPassSubject`,
    data: data
  })
  return res
}

// 闯关提交答案
export async function submitUserAnswer (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/submitUserAnswer`,
    data: data
  })
  return res
}

// 通过该关斩获积分前10名
export async function checkPointTopTen (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/checkPointTopTen`,
    data: data
  })
  return res
}

// 我的错题本
export async function getMyWrongBooks (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/getMyWrongBooks`,
    data: data
  })
  return res
}

// 老师登录
export async function teaLogin (data) {
  const res = await request({
    url: `${baseUrl}/teacherContro/teaLogin`,
    data: data
  })
  return res
}

// 老师用户数据
export async function teaMain (data) {
  const res = await request({
    url: `${baseUrl}/teacherContro/teaMain`,
    data: data
  })
  return res
}

// 班级通关情况
export async function myStudentsAverage (data) {
  const res = await request({
    url: `${baseUrl}/teacherContro/myStudentsAverage`,
    data: data
  })
  return res
}

// 查看错题
export async function reviewWrongSubject (data) {
  const res = await request({
    url: `${baseUrl}/teacherContro/reviewWrongSubject`,
    data: data
  })
  return res
}

// 通过年级查看关卡
export async function getSequence (data) {
  const res = await request({
    url: `${baseUrl}/teacherContro/getSequence`,
    data: data
  })
  return res
}

// 分享获得金币
export async function getShareCoin (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/getShareCoin`,
    data: data
  })
  return res
}

// 用户更改年级
export async function gradeChange (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/gradeChange`,
    data: data
  })
  return res
}

// 模板formid
export async function sendWxFromId (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/sendWxFromId`,
    data: data
  })
  return res
}

// getCurrentWxUsers 获取当前微信增加登录过的账号
export async function getCurrentWxUsers (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/getCurrentWxUsers`,
    data: data
  })
  return res
}
// getCurrentWxUsers 切换登录账号
export async function signOutAndLogin (data) {
  const res = await request({
    url: `${baseUrl}/studentContro/signOutAndLogin`,
    data: data
  })
  return res
}
