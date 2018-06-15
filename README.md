# yw_game

> 语文大闯关  --- A Mpvue project 

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
# 注意事项
新增的页面需要重新 npm run dev 来进行编译
```
### 需求变更 => 06.15
 * `checkLogin`接口如果用户已注册需要返回用户类型
 * 游客登录接口`visitLogin`请求参数不需要选择年级，--- 选择年级统一放到用户主页
 * 用户主页添加更改年级按钮，用户一旦更改年级则之前答题数据清零（包括头衔），分享数据保留，游客金币保留不变
 * 年级的设置以用户选择为主，与报读班级无关
