var express = require('express');
var router = express.Router();
var sha256 = require('sha256');
var moment = require('moment');
var nodemailer = require('nodemailer')
var ejs = require('ejs');
var ip = require("ip");
const path = require('path');
var appDir = path.dirname(require.main.filename);
const { prisma, run_prisma } = require("../models/Prisma_Models");
const Member_Models = require("../models/Member_Models");
const MSG = require("../models/Messages_Models");
const Token_Models = require("../models/Token_Models");
const { connect } = require('http2');
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;
const { profile, error } = require('console');

// moment().format('YYYY-MM-DD HH:mm:ss')




/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query),
  res.send("김승철");
});

 // 신규 회원등록 (비밀번호 sha256으로 비밀번호와 이메일 같이 암호화)
router.post('/', async function(req, res, next) {
  const{title, pass, name, email} = req.body
  const user_create = await Member_Models.createUser(title, pass, name, email);
  console.log(user_create);
  if (user_create.successful === false) {
    res.send('오류발생')
  }else{
    res.send('회원가입 완료')
  }
  
});

//회원정보 등록시 중복성 검사
router.post('/check', async function(req, res, next){
  const {email} = req.body
  
  const user_check = await Member_Models.checkIsEmail(email);
  console.log(user_check);
  if(user_check.successful === false){
    res.json('이메일을 사용할 수 있습니다.')
  } else {
    res.json('이메일이 중복되었습니다.')
  }
});

//회원 정보 삭제 delete 
router.post('/delete', async function(req, res, next) {
  const {idx} = req.body
  const user_delete = await Member_Models.deleteUser(idx);
  console.log(user_delete);
  if(user_delete.successful === false){
    res.send ("없는 아이디 입니다.")
    return MSG.onError(12001)
  }else{
    res.send("아이디가 삭제되었습니다.")
    return MSG.onSuccess(200)
  }
});


//회원 정보 수정 update 
router.post('/update', async function(req, res, next) {
  const{userid, updateid} = req.body
  const user_update = await Member_Models.updateUser(userid, updateid)
  console.log(user_update);
  if(user_update.successful === false){
    res.send ("변경 불가능")
    return MSG.onError(12001)
  }else{
    res.send("변경 완료")
    return MSG.onSuccess(200)
  }
});


//관리자 권한 부여(admin)
router.post('/admin', async function(req, res, next){
  const{email}= req.body
  const user_admin = await Member_Models.setAdmin(email)
  console.log(user_admin);
  if(user_admin.successful === false){
    res.send ("변경 불가능")
    return MSG.onError(12001)
  }else{
    res.send("변경 완료")
    return MSG.onSuccess(200)
  }
})


//로그인 로직 
router.post('/login', async function(req, res, next) {
  const {email, pass} = req.body
  const user_data = await Member_Models.loginUser(email, pass)
  // 이메일 없을시
  console.log(user_data);
  if(user_data.data === null){
      let temp = {
        'Code' : '200',
        'MSG' : "아이디가 일치하지 않습니다." 
    }
      res.json(temp);
    // res.json(MSG.onError(12011));
    return;
  }
  // 로그인 횟수 초과 검증
  const login_fail_count = await Member_Models.getLoginFailedCount(email)
  if(login_fail_count.data >= 10){
      let temp1 = {
        'Code' : '200',
        'MSG' : "로그인횟수 초과." 
        }
      res.json(temp1);
    return;
    }

//비밀번호를 대조
  const {mem_userpw} = user_data.data;
  console.log(user_data.data);
  if(mem_userpw !== sha256(pass + email)){
    //실패시
      const {mem_idx} = user_data.data;
      const {mem_email} = user_data.data;
      const user_login_fail = await Member_Models.failLoginLog(mem_email, mem_idx)
      console.log(user_login_fail);
      let temp = {
          'Code' : '200',
          'MSG' : "패스워드가 일치하지 않습니다." 
      }
      res.json(temp);
      
    }else{ //성공시
      console.log('login success')
        const {mem_idx} = user_data.data;
        const {mem_email} = user_data.data;
        const user_login_success = await Member_Models.successLoginLog(mem_email,mem_idx)
        console.log(user_login_success);
        let temp = {
          'Code' : '200',
          'MSG' : "로그인 되었습니다."

        }
        res.json(temp);
      
          }
        
  console.log(req.body);
  
});


//회원정보 찾기(ID)
router.post('/findid', async function(req, res, next){
  const {username} = req.body
  const user_findid = await Member_Models.findUser(username)
if (user_findid.data == null) {
  res.json('닉네임이 없습니다.')
}else{
    const {mem_email} = user_findid.data;
    res.json(mem_email)
}
});

//회원정보 찾기(password)
router.post('/findpass', async function(req, res, next){
  const {email} = req.body
  const user_findpass = await Member_Models.checkIsEmail(email)
  if (user_findpass.data !== null) {
    let authNum = Math.random().toString().substr(2,6);
    let emailTemplete;
    
    // console.log(path.join(__dirname,"../views/authCode.ejs"));

    ejs.renderFile(path.join(__dirname,"../views/authCode.ejs"), {authCode : authNum}, function (err, data) {
      if(err){console.log(err)}
      emailTemplete = data;
    });
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
        user: 'kimscaaaa2@gmail.com',
        pass: 'rlatmdcjf1!',
    },
  });

  let mailOptions = {
    from: `승철`,
    to: email,
    subject: '회원가입을 위한 인증번호를 입력해주세요.',
    html: emailTemplete,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) 
      {
        console.log(error);
    }
    console.log("Success sending email : " + info.response);
    res.send(authNum);
    transporter.close()
  });
  const auth_check = await Member_Models.saveAuthNumber(email,authNum)

// 1분뒤 저장된 인증번호 삭제
  const authcheckTime = setTimeout(() => {
  const authdelete =  Member_Models.deleteAuthNumber(authNum)
  }, 1 * 60 * 1000);
  }else{
    res.json('이메일이 없습니다.')
  }
})
// console.log(moment().format('x'))
// console.log(moment().format('X'))

// 인증번호 체크 성공시 비밀번호 초기화
router.post('/authcheck', async function(req, res, next){
const {authnumber} = req.body
const authcheck = await Member_Models.getAuthNumber(authnumber)
console.log(authcheck)
if (authcheck.data == 0) {
  res.json('인증번호가 다릅니다.')
}else{
  const{auth_email} = authcheck.data[0]
  const changepass =await Member_Models.resetPassword(auth_email)
  res.json('인증 되었습니다. 초기화된 비밀번호는 1111입니다.')
}
});

//회원 로그아웃 (refreshToken 삭제)
router.post('/logout', async function(req, res ,next){
  const {email} = req.body
  const user_logout = await Member_Models.logoutUser(email)
  res.json('로그아웃 되었습니다.')
})










// kakao 로그인 
passport.use('kakao', new KakaoStrategy({
    clientID:'a859c83a5cda73a018f1d8216f3dcbe6',
    callbackURL:'/kakao/login/callback',
  }, async (accessToken , refreshToken, profile, done)=>{
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(profile.username)
  }
))
router.get('/kakao/login', passport.authenticate('kakao'));

router.get('/kakao/login/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (res, req) => {
  res.redirect('/kako/login');
});

router.get('/kakao/logout', passport.authenticate('kakao'));





module.exports = router;
