<template>
  <div class="container">
    <!--<music-button :t="t" :r="r"  v-if="showMusicButton"></music-button>-->
    <div class="index-con" v-if="userData.userObj">
      <div class="top">
        <div class="user">
          <div class="avatar">
            <div class="hat stu_1" :class="hatType">
              <img :src="imagesSrc.hats[hatType]" alt="">
            </div>
            <open-data type="userAvatarUrl"></open-data>
          </div>
          <div class="info">
            <div class="titleUp info_con">
              <div class="icon">
                <img src="/static/images/title_logo.png">
              </div>
              <p class="text">
                {{title_text}}
              </p>
              <span @click="_changeGrad">{{currentGradName}}<i class="down"></i></span>
              <div class="bg">
                <img src="/static/images/info_bg.png">
              </div>
            </div>
            <div class="name info_con">
              <div class="icon">
                <img src="/static/images/sun.png">
              </div>
              <p class="text">
                {{userData.userObj.teacherName || userData.userObj.username || userData.userObj.nickName2 || userData.userObj.nickName}}
              </p>
              <div class="bg">
                <img src="/static/images/info_bg.png">
              </div>
            </div>
            <!-- <div class="phone info_con" v-if="userType === '2'">
              <div class="icon">
                <img src="/static/images/phone.png">
              </div>
              <p class="text">{{userData.userObj.phone || '&#45;&#45;'}}</p>
              <div class="bg">
                <img src="/static/images/info_bg.png">
              </div>
            </div> -->
          </div>
        </div>
        <div class="status">
          <status-card :text="userData.userObj.goldCoin || '--'" :imgUrl="imagesSrc.gold" v-if="userType === '3'"></status-card>
          <status-card v-if="userType !== '1'" :text="userData.userObj.integralCount || '--'" :imgUrl="imagesSrc.score"></status-card>
          <!--<status-card :text="`第${userData.userObj.perSequenceCn || '&#45;&#45;'}期`"></status-card>-->
          <status-card :text="sea"></status-card>
        </div>
      </div>
      <div class="con" v-if="userType !== '1'">
        <div class="buttonGroup">
          <div class="btn-item">
            <div class="btn flipInY" v-if="userType === '3'">
              <shadow-button :imgUrl="imagesSrc.stu" :borderRadius="'25rpx'" @tapEvent="goToStuLogin"></shadow-button>
            </div>
            <div class="btn flipInY" v-else>
              <img :src="imagesSrc.stuNull" style="width: 100%; height: 100%;border-radius: 25rpx">
            </div>
          </div>
          <div class="btn-item">
            <div class="btn flipInY" v-if="userType === '3'">
              <shadow-button :imgUrl="imagesSrc.teach" :borderRadius="'25rpx'" @tapEvent="goToTeachLogin"></shadow-button>
            </div>
            <div class="btn flipInY" v-else>
              <img :src="imagesSrc.teachNull" style="width: 100%; height: 100%;border-radius: 25rpx">
            </div>
          </div>
          <div class="btn-item">
            <div class="btn flipInY">
              <shadow-button :imgUrl="imagesSrc.help" :borderRadius="'25rpx'" @tapEvent="goToPage('helper')"></shadow-button>
            </div>
          </div>
        </div>
        <div class="cardGroup">
          <div class="card flipInX" @click="goToPageLevel(1)">
            <stu-card :imgUrl="imagesSrc.cards.s1">
              <div class="card-con">
                <div class="rocket card-img1" :class="{shake: shakeN === 1}">
                  <img src="/static/images/rocket.png">
                </div>
                <div class="card-info">
                  <div class="answer card-img2">
                    <img src="/static/images/answer.png">
                  </div>
                  <div class="text">
                    <!--<div>第<span>{{userData.userObj.perSequence}}</span>期</div>-->
                    <div><span>{{sea}}</span></div>
                    <div class="ml50">共<span>{{userData.ckCount}}</span>关</div>
                  </div>
                </div>
              </div>
            </stu-card>
          </div>
          <div class="card flipInX"  @click="goToPageWrongBook(2)">
            <stu-card :imgUrl="imagesSrc.cards.s2">
              <div class="card-con">
                <div class="book card-img1" :class="{shake: shakeN === 2}">
                  <img src="/static/images/book.png">
                </div>
                <div class="card-info">
                  <div class="wrong_book card-img2">
                    <img src="/static/images/wrong_book.png">
                  </div>
                  <div class="text">
                    <!--<div>第<span>{{userData.userObj.perSequence}}</span>期</div>-->
                    <div><span>{{sea}}</span></div>
                    <div class="ml50">共<span>{{userData.ckCount}}</span>关</div>
                  </div>
                </div>
              </div>
            </stu-card>
          </div>
          <div class="card flipInX" style="height: 190rpx;" @click="goToPage('rank')">
            <stu-card :imgUrl="imagesSrc.cards.s3">
              <div class="card-con">
                <div class="rank">
                  <img src="/static/images/rank.png">
                </div>
                <div class="rank-info">
                  <div class="rank-item stu" style="margin-left: 0;" v-if="studentRanking.length > 1">
                    <div class="rank-img">
                      <img :src="studentRanking[1].avatarUrl" alt="" style="width: 100%; height: 100%">
                      <div class="rank-icon" style="width: 61rpx;height: 48rpx;">
                        <!--<img :src="imagesSrc.ranking.sec" alt="">-->
                        <img src="/static/images/sec.png">
                      </div>
                    </div>
                    <div class="rank-name">
                      <div class="name">{{studentRanking[1].username || studentRanking[1].nickName2 || studentRanking[1].nickName}}</div>
                      <div class="score">
                      <span class="icon">
                        <!--<img :src="imagesSrc.score" alt="">-->
                        <img src="/static/images/score.png" alt="">
                      </span>
                        {{studentRanking[1].integralCount}}
                      </div>
                    </div>
                  </div>
                  <div class="rank-item stu" v-if="studentRanking.length">
                    <div class="rank-img">
                      <img :src="studentRanking[0].avatarUrl" alt="" style="width: 100%; height: 100%">
                      <div class="rank-icon" style="width: 70rpx;height: 44rpx;">
                        <img src="/static/images/fir.png">
                      </div>
                    </div>
                    <div class="rank-name">
                      <div class="name">{{studentRanking[0].username || studentRanking[0].nickName2 || studentRanking[0].nickName}}</div>
                      <div class="score">
                      <span class="icon">
                        <img src="/static/images/score.png" alt="">
                      </span>
                        {{studentRanking[0].integralCount}}
                      </div>
                    </div>
                  </div>
                  <div class="rank-item stu" v-if="studentRanking.length > 2">
                    <div class="rank-img">
                      <img :src="studentRanking[2].avatarUrl" alt="" style="width: 100%; height: 100%">
                      <div class="rank-icon" style="width: 55rpx;height: 44rpx;">
                        <img src="/static/images/thir.png">
                      </div>
                    </div>
                    <div class="rank-name">
                      <div class="name">{{studentRanking[2].nickName || studentRanking[2].nickName2 || studentRanking[2].nickName}}</div>
                      <div class="score">
                      <span class="icon">
                        <img src="/static/images/score.png" alt="">
                      </span>
                        {{studentRanking[2].integralCount}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </stu-card>
          </div>
        </div>
      </div>
      <div class="con" v-if="userType === '1'" style="max-height: 810rpx;overflow-y: auto;margin-top: 50rpx;">
        <div class="t-card flipInX" @click="goToWronBook">
          <stu-card :imgUrl="imagesSrc.cards.s1">
            <div class="tcard-con">
              <h1 class="cBlack">查看错题集</h1>
              <div class="text">
                <!--<div>第<span>{{userData.userObj.perSequence}}</span>期</div>-->
                <div><span>{{sea}}</span></div>
                <div class="ml50">共<span>{{userData.ckCount}}</span>关</div>
              </div>
            </div>
          </stu-card>
        </div>
        <div class="t-card flipInX"  @click="goToPageLevel">
          <stu-card :imgUrl="imagesSrc.cards.s2">
            <div class="tcard-con">
              <h1 class="cGray">答题闯关</h1>
              <div class="text">
                <!--<div>第<span>{{userData.userObj.perSequence}}</span>期</div>-->
                <div><span>{{sea}}</span></div>
                <div class="ml50">共<span>{{userData.ckCount}}</span>关</div>
              </div>
            </div>
          </stu-card>
        </div>
        <!--老师课程-->
        <div class="t-list" v-if="userData.teaClassMsg.length">
          <div class="t-card flipInX" v-for="(classItem, index) in userData.teaClassMsg" @click="_goToTeacherRank(classItem)" :key="classItem.subjectsClassID">
            <div class="t-card-con">
              <img :src="imagesSrc.cards.s3" alt="">
              <div class="content">
                <div class="tcard-con">
                  <h1 class="cWhite">{{classItem.subjectsClassName}}({{classItem.gradeName}})</h1>
                  <div class="text">
                    <div>共<span>{{classItem.countStudent}}</span>人</div>
                    <div class="ml50">平均通过<span>{{classItem.teaAverage}}</span>闯关</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--
          <div class="t-card">
            <stu-card :imgUrl="imagesSrc.cards.s4">
              <div class="tcard-con">
                <h1 class="cWhite">易启说外教实景课</h1>
                <div class="text cWhite">
                  <div>共<span>18</span>人</div>
                  <div class="ml50">平均通过<span>6</span>闯关</div>
                </div>
              </div>
            </stu-card>
          </div>
          <div class="t-card">
            <stu-card :imgUrl="imagesSrc.cards.s1">
              <div class="tcard-con">
                <h1 class="cWhite">卓越大语文培优班</h1>
                <div class="text">
                  <div>共<span>18</span>人</div>
                  <div class="ml50">平均通过<span>6</span>闯关</div>
                </div>
              </div>
            </stu-card>
          </div>
          -->
        </div>
      </div>
    </div>
    <!--底部-->
    <foot :imgUrl="imagesSrc.foot" v-if="userData.userObj"></foot>
    <!--微信授权登录-->
    <wx-login v-if="showWxLogin" @hideWxLogin="_hide" @goToIndex="_goToIndex"></wx-login>
    <!--弹窗选年级-->
    <div class="visitor zoomInUp" v-if="showSelGrad">
      <div class="flexColum">
        <div class="close" @click="_cancelSelGrad" v-if="!hideClose">
          <img src="/static/images/visit/close.png">
        </div>
        <div class="title">
          <img src="/static/images/visit/visit_title.png">
         </div>
         <div class="content">
           <h1 class="small">
             <img src="/static/images/visit/small.png">
           </h1>
           <div class="con">
             <div class="img" v-for="(gradS, index) in gradeSmallSrc" :key="gradS.grad" @click="_selGrad(gradS.grad)">
               <img :src="gradS.gradSel" v-if="gradS.grad === selGrad">
               <img :src="gradS.gradImg" v-else>
             </div>
           </div>
           <h1  class="middle">
             <img src="/static/images/visit/middle.png">
           </h1>
           <div class="con">
             <div class="img" v-for="(gradM, index) in gradeMiddleSrc" :key="gradM.grad"  @click="_selGrad(gradM.grad)">
               <img :src="gradM.gradSel" v-if="gradM.grad === selGrad">
               <img :src="gradM.gradImg" v-else>
             </div>
           </div>
         </div>
         <div class="bottom">
           <div class="btn">
             <div class="sure">
               <icon-button :imgUrl="imagesSrc.visit.sure" @tapEvent="_gradeChange"></icon-button>
             </div>
             <div class="cancel" v-if="!hideClose">
               <icon-button :imgUrl="imagesSrc.visit.cancel" @tapEvent="_cancelSelGrad"></icon-button>
             </div>
           </div>
         </div>
      </div>
    </div>
    <!--弹窗提示信息-->
    <div class="visitor zoomInUp" style="height: 570rpx" v-if="showTip">
      <div class="flexColum">
        <div class="close" @click="showTip = false">
          <img src="/static/images/visit/close.png">
        </div>
        <div class="content">
          <div class="p_con">
            <p>过关所用挑战次数越少，</p>
            <p>所花时间越短，</p>
            <p>获得的奖励就越多哦！</p>
          </div>
        </div>
        <div class="bottom">
          <div class="btn">
            <div class="sure more">
              <icon-button :imgUrl="imagesSrc.visit.more" @tapEvent="_goToTip"></icon-button>
            </div>
            <div class="cancel cancel2">
              <icon-button :imgUrl="imagesSrc.visit.cancel2" @tapEvent="showTip = false"></icon-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
//  import musicButton from '@/components/music-button'
  import StatusCard from '@/components/status-card'
  import foot from '@/components/foot'
  import shadowButton from '@/components/shadow-button'
  import stuCard from '@/components/stu-card'
  import iconButton from '@/components/icon-button'
  import wxLogin from '@/components/wxLogin'
  import {getUserData, teaMain, checkUser, gradeChange} from '@/utils/api'
  import {changeNum} from '@/utils/index'
  import {grads, season} from '@/utils/baseUrl'

  export default {
    data () {
      return {
        imagesSrc: {
          hats: {
            stu_1: require('static/images/hats/stu_1.png'),
            stu_2: require('static/images/hats/stu_2.png'),
            stu_3: require('static/images/hats/stu_3.png'),
            stu_4: require('static/images/hats/stu_4.png'),
            stu_5: require('static/images/hats/stu_5.png'),
            stu_6: require('static/images/hats/stu_6.png')
          },
          score: require('static/images/score.png'),
          gold: require('static/images/gold.png'),
          foot: require('static/images/foot_img.png'),
          stu: require('static/images/stu.png'),
          teach: require('static/images/teach.png'),
          stuNull: require('static/images/stuNull.png'),
          teachNull: require('static/images/teachNull.png'),
          help: require('static/images/help.png'),
          cards: {
            s1: require('static/images/card/s1.png'),
            s2: require('static/images/card/s2.png'),
            s3: require('static/images/card/s3.png'),
            s4: require('static/images/card/t4.png')
          },
          visit: {
            sure: require('static/images/visit/sure.png'),
            cancel: require('static/images/visit/cancel.png'),
            more: require('static/images/visit/more.png'),
            cancel2: require('static/images/visit/cancel2.png')
          }
        },
        hatType: 'stu_6',
        userType: '1', // 用户类型：1：教师， 2：学生， 3：游客
        openid: wx.getStorageSync('openid'),
        userData: {},
        studentRanking: [], // 学生排名
        subjectsClassID: '', // 班级id
        showSelGrad: false,
        selGrad: '',
        showWxLogin: false,
        oldGrad: '',
        currentGradName: '--',
        shakeN: 0,
        t: '360rpx',
        r: '30rpx',
        title_text: '新手', // 头衔名称
        hideClose: false, // 设置是否隐藏角色选年级的关闭按钮
        sea: '', // 年份季节
        showTip: false // 显示提示助手
      }
    },
    computed: {
      // 选择年级---小学
      gradeSmallSrc: function () {
        let arr = [2, 3, 4, 5, 6]
        return this._initSrc(arr)
      },
      // 选择年级----初中
      gradeMiddleSrc: function () {
        let arr = [11, 12, 13]
        return this._initSrc(arr)
      }
    },
    created () {
    },
    methods: {
      // 跳转小助手
      _goToTip () {
        this.showTip = false
        this.hideClose = false
        this.goToPage('helper')
      },
      // 取消选年级
      _cancelSelGrad () {
        this.selGrad = this.oldGrad
        this.showSelGrad = false
      },
      // 更改年级
      _changeGrad () {
        let _this = this
        wx.showModal({
          title: '更改年级',
          content: '年级更改之后，之前闯关获得的头衔和金币将清零哦，确认更改吗？',
          success: (res) => {
            if (res.confirm) {
              _this.showSelGrad = true
              _this.oldGrad = _this.selGrad
            } else if (res.cancel) {
            }
          }
        })
      },
      // 确认更改年级
      _gradeChange () {
        if (this.selGrad === '') { // 必须选年级
          wx.showToast({
            title: '亲，请选择一个年级！',
            icon: 'none'
          })
          return
        }
        let param = {
          openid: wx.getStorageSync('openid'),
          graId: this.selGrad,
          userType: wx.getStorageSync('userType')
        }
        gradeChange(param).then((res) => {
          if (res.success) {
            this.showSelGrad = false
            if (this.hideClose) { // 从登陆页进入
              this.showTip = true
              this.hideClose = false
            }
            this.getUserData()
          }
        })
      },
      // 申请微信openid权限
      _hide () {
        this.getUserData()
        this.showWxLogin = false
      },
      _goToIndex () {
        this.goToPage('index')
        this.showWxLogin = false
      },
      // 初始化调用图片
      _initSrc (arr) {
        let urls = []
        for (let i = 0; i < arr.length; i++) {
          urls.push({
            grad: arr[i],
            gradImg: require(`static/images/visit/${arr[i]}.png`),
            gradSel: require(`static/images/visit/${arr[i]}_sel.png`)
          })
        }
        return urls
      },
      // 选择年级
      _selGrad (val) {
        this.selGrad = val
      },
      getUserData () {
        let data = {openid: wx.getStorageSync('openid')}
        let fn = null
        if (wx.getStorageSync('userType') === '1') {
          fn = teaMain // 教师主页数据
        } else {
          fn = getUserData // 学生和游客数据
        }
        fn(data).then((res) => {
          if (res.success) {
            this.userData = res.data
            this.userData.userObj.perSequenceCn = changeNum(this.userData.userObj.perSequence)
            this.userType = res.data.weixinObj.usertype
            this.hatType = `stu_${this.userData.userObj.titleup}`
            let seaName = ''
            for (let item of season) {
              if (item.seasonId === res.data.per_seaId) {
                seaName = item.seasonName
              }
            }
            this.sea = `${this.userData.per_year}${seaName}`
            switch (this.userData.userObj.titleup) {
              case '0':
                this.title_text = '新手'
                break
              case '1':
                this.title_text = '童生'
                break
              case '2':
                this.title_text = '秀才'
                break
              case '3':
                this.title_text = '举人'
                break
              case '4':
                this.title_text = '贡士'
                break
              case '5':
                this.title_text = '进士'
                break
              case '6':
                this.title_text = '状元'
                break
            }
            for (let val of grads) {
              if (val.gradId === res.data.userObj.graId) {
                this.currentGradName = val.gradName
              }
            }
            /* 未选过年级 */
            if (res.data.userObj.graId === '0') {
              this.showSelGrad = true
              this.hideClose = true
            }
            wx.setStorageSync('userData', res.data)
            wx.setStorageSync('graId', res.data.userObj.graId)
            wx.setStorageSync('perSequence', res.data.userObj.perSequence)
            // 用户前三排名信息
            if (res.data.studentRanking) {
              this.studentRanking = res.data.studentRanking
              this.studentRanking.sort((a, b) => {
                return parseInt(b.integralCount) - parseInt(a.integralCount)
              })
            }
            console.log('rank：', this.studentRanking)
          } else {
            wx.showToast({
              title: res.desc,
              icon: 'none'
            })
          }
        })
      },
      // 老师查看错题集
      goToWronBook () {
        let sea = this.sea
        let perSequence = this.userData.userObj.perSequence
        let param = `?perSequence=${perSequence}&sea=${sea}`
        this.goToPage('teacher-wrongBook', param)
      },
      // 跳转老师登录注册
      goToTeachLogin () {
        let param = `?userType=1`
        this.goToPage('index', param)
      },
      // 跳转学生登录注册
      goToStuLogin () {
        let param = `?userType=2`
        this.goToPage('index', param)
      },
      // 跳转选关
      goToPageLevel (n) {
        let mySequence = this.userData.userObj.mySequence // 已通关卡数
        let perSequence = this.userData.userObj.perSequence // 期数
        let sea = this.sea // 年份季节
        let levelNum = this.userData.ckCount // 总关卡数
        let gradId = this.userData.userObj.graId // 年级id
        let integralCount = this.userData.userObj.integralCount // 总金币
        let param = `?mySequence=${mySequence}&perSequence=${perSequence}&levelNum=${levelNum}&gradId=${gradId}&integralCount=${integralCount}&sea=${sea}`
        let _this = this
        this.shakeN = n
        setTimeout(() => {
          _this.shakeN = 0
          _this.goToPage('level', param)
        }, 250)
      },
      // 学生跳转错题本
      goToPageWrongBook (n) {
        this.shakeN = n
        let _this = this
        let perSequence = this.userData.userObj.perSequence
        let sea = this.sea
        let param = `?perSequence=${perSequence}&sea=${sea}`
        setTimeout(() => {
          _this.shakeN = 0
          _this.goToPage('stu-wrongBook', param)
        }, 250)
        // this.goToPage('stu-wrongBook', param)
        // this.goToPage('top10', param)
      },
      // 老师查看班级排行
      _goToTeacherRank (item) {
        let param = `?subjectsClassID=${item.subjectsClassID}&countStudent=${item.countStudent}&teaAverage=${item.teaAverage}&subjectName=${item.subjectsClassName}`
        this.goToPage('teacher-rank', param)
      },
      // 跳转页面
      goToPage (page, param) {
        let url = param ? `../${page}/main${param}` : `../${page}/main`
        wx.navigateTo({url: url})
      }
    },
    onLoad (opt) {
      if (opt.openid) { // 用户分享进入
        wx.setStorageSync('shareOpenid', opt.openid)
      }
      if (opt.flag) { // 从登陆注册页进入
        this.showSelGrad = true
        this.hideClose = true
      }
    },
    onShow (opt) {
      console.log('show-main', opt)
      if (wx.getStorageSync('openid')) {
        // 校验是否当期
        wx.showLoading({
          title: '数据加载中...'
        })
        checkUser({openid: wx.getStorageSync('openid')}).then((res) => {
          if (res.success) {
            wx.hideLoading()
            wx.setStorageSync('userType', res.data.usertype)
            if (!this.showSelGrad) {
              this.getUserData()
            }
          } else {
            // 进入登录注册
            this.goToPage('index')
          }
        })
      } else {
        this.showWxLogin = true
      }
    },
    components: {
      StatusCard,
      foot,
      shadowButton,
      stuCard,
      iconButton,
      wxLogin
    }
  }
</script>

<style scoped>
  /*@import "../../utils/font.css";*/
  img{
    width: 100%;
    height: 100%;
  }
  .index-con{
    width: 100%;
    min-height: 1000rpx;
    overflow-y: auto;
  }
  .top{
    position: relative;
    height: 190rpx;
    width: 100%;
    background-color: #ffcc66;
  }
  /*用户头像姓名电话信息*/
  .top .user{
    display: flex;
  }
  .top .user .avatar{
    position: relative;
    margin-left: 45rpx;
    margin-top: 35rpx;
    width: 112rpx;
    height: 112rpx;
    border: 10rpx solid #ffffff;
    border-radius: 10rpx;
    background-color: #ffffff;
    font-size: 0;
  }
  .top .user .avatar .hat{
    position: absolute;
    z-index: 10;
    transform-origin: 50% 50%;
    transform: rotate(-30deg);
  }
  .stu_1{
    left: -50rpx;
    top: -40rpx;
    width: 112rpx;
    height: 72rpx;
  }
  .stu_2{
    left: -60rpx;
    top: -45rpx;
    width: 140rpx;
    height: 76rpx;
  }
  .stu_3{
    left: -55rpx;
    top: -40rpx;
    width: 130rpx;
    height: 67rpx;
  }
  .stu_4{
    left: -55rpx;
    top: -40rpx;
    width: 120rpx;
    height: 63rpx;
  }
  .stu_5{
    left: -60rpx;
    top: -45rpx;
    width: 140rpx;
    height: 64rpx;
  }
  .stu_6{
    left: -60rpx;
    top: -45rpx;
    width: 140rpx;
    height: 82rpx;
  }
  .top .user .info{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    box-sizing: border-box;
    position: relative;
    margin-left: 25rpx;
    padding-top: 50rpx;
  }
  .top .user .info .info_con{
    position: relative;
    display: flex;
    height: 50rpx;
    vertical-align: bottom;
    font-size: 28rpx;
  }
  .top .user .info .info_con p.text{
    position: relative;
    z-index: 2;
    padding: 0 30rpx 0 10rpx;
    line-height: 50rpx;
    font-weight: 700;
    max-width: 180rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .top .user .info .info_con span{
    line-height: 45rpx;
    color: #450000;
    position: relative;
    background: rgba(255, 255, 255, 0.8);
    padding: 0 30rpx 0 15rpx;
    border-radius: 10rpx;
    font-size: 28rpx;
  }
  .top .user .info .info_con span i{
    position: absolute;
    right: 8rpx;
    bottom: 20rpx;
    height: 0rpx;
    width: 0rpx;
    border-top: 10rpx solid #450000;
    border-left: 10rpx solid transparent;
    border-right: 10rpx solid transparent;
  }
  .top .user .info .change_btn{
    font-size: 28rpx;
  }
  .top .user .info .name .icon{
    display: inline-block;
    width: 50rpx;
    height: 50rpx;
    font-size:0;
  }
  .top .user .info .titleUp .icon {
    display: inline-block;
    width: 45rpx;
    height: 45rpx;
    font-size:0;
    margin-right: 5rpx;
  }
  .top .user .info .phone .icon{
    width: 30rpx;
    height: 50rpx;
    font-size:0;
  }

  .top .user .info .info_con .bg{
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    font-size:0;
    width: auto;
    min-width: 200rpx;
    height: 20rpx;
  }
  .top .user .info .name .bg{
    width: auto;
    min-width: 250rpx;
  }
  /* 期数钻石金币信息 */
  .top .status{
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
  }
  .con{
    width: 640rpx;
    margin: 0 auto;
  }
  .con .buttonGroup{
    width: 100%;
    display: flex;
    padding: 28rpx 0;
    justify-content: center;
  }
  .con .buttonGroup .btn-item{
    flex: 1;
    text-align: center;
  }
  .con .buttonGroup .btn{
    display: inline-block;
    width: 140rpx;
    height: 140rpx;
  }
  .con .cardGroup .card{
    width: 100%;
    height: 200rpx;
    margin-bottom: 16rpx;
  }
  .con .cardGroup .card .card-con{
    font-size: 0;
    display: flex;
    height: 100%;
    width: 100%;
  }
  .con .cardGroup .card .card-con .rocket{
    width: 200rpx;
    height: 150rpx;
    padding: 25rpx 16rpx 0 55rpx;
  }
  .con .cardGroup .card .card-con .book{
    width: 164rpx;
    height: 159rpx;
    padding: 25rpx 42rpx 0 55rpx;
  }
  .con .cardGroup .card .card-con .card-info{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .con .cardGroup .card .card-con .card-info .card-img2{
    font-size: 0;
    margin-top: 20rpx;
  }
  .wrong_book{
    width: 236rpx;
    height: 96rpx;
  }
  .answer{
    width: 210rpx;
    height: 93rpx;
  }

  .con .cardGroup .card .card-con .card-info .text{
    display: flex;
    justify-content: center;
    font-size: 32rpx;
    color: #002abb;
    width: 85%;
    padding-bottom: 20rpx;
  }
  .con .cardGroup .card .card-con .card-info .text span{
    color: #ffffff;
  }
  .ml50{
    margin-left: 50rpx;
  }
  .rank{
    width: 212rpx;
    height: 142rpx;
    margin-left: -20rpx;
    margin-top: 45rpx;
  }
  .rank-info{
    flex: 1;
    display: flex;
    height: 100%;
    box-sizing: border-box;
    padding: 10rpx 0 30rpx;
  }
  .rank-item{
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 100rpx;
    margin-left:40rpx;
  }

  .rank-info .rank-img {
    position: relative;
    bottom: 0;
    left: 0;
    width: 94rpx;
    height: 94rpx;
    border: 6rpx solid #ffffff;
    border-radius: 50%;
    font-size: 0;
  }
  .rank-info .rank-img>img{
    border-radius: 50%;
  }
  .rank-info .rank-img .rank-icon{
    position: absolute;
    bottom: -10rpx;
    right: 0;
    margin-right: -40%;
    width: 60rpx;
    height: 80rpx;
  }
  .rank-item .rank-name{
    display: none;
  }

  .rank-item.stu{
  }
  .rank-item.stu .rank-img{
  }
  .stu .rank-name{
    display: inline-block;
    flex: 1;
    width: 100%;
    text-align: center;
  }
  .stu .rank-name .name{
    font-size: 24rpx;
    color: #000;
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .stu .rank-name .score{
    position: relative;
    font-size: 20rpx;
    color: #ffffff;
    line-height: 28rpx;
  }
  .stu .rank-name .score .icon{
    display: inline-block;
    width: 20rpx;
    height: 20rpx;
    font-size: 0;
    margin-right: 10rpx;
  }
  /*教师*/
  .t-list{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .t-card{
    width: 100%;
    height: 150rpx;
    margin-bottom: 10rpx;
  }
  .t-card .tcard-con{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .t-card .tcard-con h1{
    font-size: 40rpx;
    text-align: center;
    font-family: "fzmiaowu";
  }
  .t-card .tcard-con .text{
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    margin-top:20rpx;
    color: #002abb;
  }
  .t-card .tcard-con .text span{
    color: #ffffff;
  }
  .cBlack{
    color: #003300 !important;
  }
  .cGray{
    color: #572300 !important;
  }
  .cBlue{
    color: #002abb !important;
  }
  .cWhite{
    color: #ffffff !important;
  }
  .visitor{
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 672rpx;
    height: 734rpx;
    border-radius: 16rpx;
    background-color: rgba(0,0,0,0.8);
  }
  .visitor .flexColum{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .visitor img{
    width: 100%;
    height: 100%;
  }
  .visitor .flexColum .close{
    position: absolute;
    top: 6rpx;
    right: 0;
    width: 30rpx;
    height: 30rpx;
    font-size: 0;
    padding: 18rpx;
  }
  .visitor .title{
    padding-top: 36rpx;
    width: 480rpx;
    height: 84rpx;
    font-size: 0;
  }
  .visitor .content{
    width: 100%;
    box-sizing: border-box;
    padding: 0 34rpx;
  }
  .visitor .content .p_con {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 85rpx 50rpx 0;
  }
  .visitor .content p{
    text-align: left;
    font-size: 40rpx;
    color: #ffffff;
    padding: 20rpx 0;
  }
  .visitor .content h1{
    width: 100%;
    text-align: left;
    width: 83rpx;
    height: 35rpx;
    font-size: 0;
    padding:10rpx 0 5rpx 20rpx;
  }
  .visitor .content .con{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .visitor .content .img{
    flex: 0 0 172rpx;
    font-size: 0;
    width: 172rpx;
    height: 62rpx;
    padding: 15rpx 12rpx;
  }
  .visitor .bottom{
    padding: 40rpx 0 58rpx 0;
  }

  .visitor .bottom .btn .sure, .visitor .bottom .btn .cancel{
    float: left;
    width: 177rpx;
    height: 78rpx;
    padding: 0 36rpx;
  }
  .visitor .bottom .btn .sure.more{
    width: 263rpx;
    height: 78rpx;
    padding:0 20rpx;
  }
  .visitor .bottom .btn .cancel.cancel2{
    width: 192rpx;
    height: 78rpx;
    padding:0 20rpx;
  }
  .t-card-con{
    width: 100%;
    height:100%;
    font-size: 0;
    position: relative;
  }
  .t-card-con img{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .t-card-con .content{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  @keyframes flipInX {
    from {
      transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
      animation-timing-function: ease-in;
      opacity: 0;
    }

    40% {
      transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
      animation-timing-function: ease-in;
    }

    60% {
      transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
      opacity: 1;
    }

    80% {
      transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }

    to {
      transform: perspective(400px);
    }
  }

  .flipInX {
    backface-visibility: visible !important;
    animation: flipInX 1s linear;
  }
  @keyframes flipInY {
    from {
      transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
      animation-timing-function: ease-in;
      opacity: 0;
    }
    40% {
      transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
      animation-timing-function: ease-in;
    }
    60% {
      transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
      opacity: 1;
    }
    80% {
      transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
    }
    to {
      transform: perspective(400px);
    }
  }
  .flipInY {
    backface-visibility: visible !important;
    animation-name: flipInY;
  }

  @keyframes zoomInUp {
    from {
      opacity: 0;
      -webkit-transform: scale3d(0.1, 0.1, 0.1);
      transform: scale3d(0.1, 0.1, 0.1);
      -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    60% {
      opacity: 1;
      -webkit-transform: scale3d(0.475, 0.475, 0.475);
      transform: scale3d(0.475, 0.475, 0.475);
      -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
      animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
  }

  .zoomInUp {
    animation: zoomInUp 0.5s linear;
  }
  .shake{
    transform-origin: center bottom;
    transform: rotate(20deg);
    animation: shake 0.1s linear 0s 5 alternate;
  }
  @keyframes shake {
    0% {
      transform: rotate(0deg)
    }
    25% {
      transform: rotate(-10deg)
    }
    50% {
      transform: rotate(10deg)
    }
    75% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(-10deg)
    }
  }
</style>
