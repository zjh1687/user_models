const { prisma, run_prisma } = require("./Prisma_Models");
const Token_Models = require("./Token_Models");
const MSG = require("./Messages_Models");
var sha256 = require('sha256');
var moment = require('moment');
var ip = require("ip");



class Test {
    constructor(){

    }
// 이메일 중복성 체크
    async checkIsEmail(email){
        const result = await run_prisma(
            prisma.rs_member.findUnique({
                where:{
                    mem_email:email
                }
            })
        );
        if(result.successful === true){
            console.log(result);
            if(result.data === null){
                return MSG.onError(99999)
            }else{
                return result;
            }
        }
    }
//  회원 가입
    async createUser(userid, pass, email){
        const result = await run_prisma(
            prisma.rs_member.create({
                data:{
                    mem_userid:userid,
                    mem_userpw:sha256(pass + email),
                    mem_email:email,
                    mem_lastlogin_datetime:moment().format('YYYY-MM-DD HH:mm:ss'),
                    mem_lastlogin_timestamp:moment().unix()
                }
            })
        );
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }

// 아이디 삭제
    async deleteUser(idx){
        const result = await run_prisma(
            prisma.rs_member.delete({
                where:{
                    mem_idx:Number(idx)
                }
            })
        );
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }
// 아이디 수정
    async updateUser(userid, updateid){ 
        const result = await run_prisma(
            prisma.rs_member.update({
                where:{
                    mem_userid:userid
                },
                data:{
                    mem_userid:updateid
                },
            })
        );
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }
// 관리자 권한 부여
    async setAdmin(email){
        const result = await run_prisma(
            prisma.rs_member.update({
                where:{
                    mem_email:email
                },
                data:{
                    mem_is_admin:Number(1)
                }
            })
        );
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }
    

// 로그인 (이메일 대조)
    async loginUser(email, pass){
        const result = await run_prisma(
            prisma.rs_member.findUnique({
                where: {
                    mem_email:email
                },
            })
        )
        if(result.successful === true){
            console.log(result);
            if(result.data === null){
                return MSG.onError(99999)
            }else{
                return result;
            }
        }
    }        
// 로그인 실패시
    async failLoginLog(mem_email,mem_idx){
        const result = await run_prisma(
            prisma.rs_mem_login_log.create({
                data:{
                    mll_success : 0,
                    mll_mem_idx :Number(mem_idx),
                    mll_email: mem_email,
                    mll_datetime:moment().format('YYYY-MM-DD HH:mm:ss'),
                    mll_reason: "로그인 실패 ",
                    mll_timestamp: moment().unix(),
                    mll_ip:ip.address() 
                }
            })
        )
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }
// 로그인 성공시 (토큰 생성)
    async successLoginLog(mem_email, mem_idx){
        const result = await run_prisma(
            prisma.rs_mem_login_log.create({
                data:{
                    mll_success : 1,
                    mll_mem_idx : Number(mem_idx),
                    mll_email: mem_email,
                    mll_datetime:moment().format('YYYY-MM-DD HH:mm:ss'),
                    mll_reason: "로그인 성공 ",
                    mll_timestamp: moment().unix(),
                    mll_ip: ip.address()
                }
            })
        )
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        }
            const accessToken = await Token_Models.generateAccessToken({mem_idx},null , 999999)
                if(accessToken.successful === false){
                    console.log(accessToken);
                    return MSG.onError(99999)
                }
            const refreshToken = await Token_Models.generateRefreshToken({mem_idx})
                if(refreshToken.successful === false){
                    console.log(refreshToken);
                    return MSG.onError(99999)
                }
            console.log("-------", accessToken , refreshToken);
// 로그인 성공시 최근 로그인기록 업데이트
            const result1 = await run_prisma(
                prisma.rs_member.update({
                    where:{
                        mem_idx:Number(mem_idx)
                    },
                    data:{
                        mem_lastlogin_datetime:moment().format('YYYY-MM-DD HH:mm:ss'),
                        mem_lastlogin_timestamp:moment().unix()
                    }
                })
            )
            if(result1.successful === false){
                console.log(result1);
                return MSG.onError(99999)
            }                                                                    
// 로그인 성공 시 토큰 저장 (refreshtoken)
            const result2 = await run_prisma(
            prisma.rs_mem_token.create({
                data :{
                    mtk_refresh: refreshToken.data,
                    mtk_email: mem_email
                }
            })
        )
        if(result2.successful === false){
            console.log(result2);
            return MSG.onError(99999)
        } else {
            console.log("----" ,result2)
            return MSG.onSuccess(200)
        }
        
    }

// 아이디 찾기
    async findUser(userid){
        const result = await run_prisma(
            prisma.rs_member.findUnique({
                where:{
                    mem_userid : userid
                }
            })
        )
        if(result.successful === true){
            console.log(result);
            if(result.data === null){
                return MSG.onError(99999)
            }else{
                return result;
            }
        }
    }

    // 로그인 실패시 카운트
    async failCount (mem_email){
        const result = await run_prisma(
            prisma.rs_mem_login_log.update({
                where:{
                    mll_email:mem_email 
                },
                data:{
                    mll_fail_count:{
                        increment:Number(1)
                    }
                }
            })
        )
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }

        // 로그인 실패 카운트 
        async getLoginFailedCount (email){
            const result = await run_prisma(
                prisma.rs_mem_login_log.findMany({ 
                    where:{
                        mll_email:email 
                    },
                    orderBy:{
                        mll_idx: "desc"
                    }
                })
            )
            if(result.successful === false){
                console.log(result)
                return result
            }
            let loginFailedCount = 0;
            for(const _loginLog of result.data){
                if(_loginLog.mll_success === 0){
                    loginFailedCount++;
                } else {
                    break;
                }
            }
            return MSG.onSuccess(99999,loginFailedCount);
        }

    //발급 인증번호 저장
    async saveAuthNumber (email,authNum){
        const result = await run_prisma(
            prisma.rs_mem_auth.create({
                data:{
                    auth_email: email,
                    authNumber:Number(authNum),
                    auth_datetime:moment().format('YYYY-MM-DD HH:mm:ss')
                }
            })
        )
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }

    // 1분뒤 저장된 인증번호 삭제
    async deleteAuthNumber (authNum){
        const result = await run_prisma(
            prisma.rs_mem_auth.deleteMany({
                where:{
                    authNumber:Number(authNum)
                }
            })
        )
        if(result.successful ===true){
            if(result.data.count === 0 ){
                console.log(result);
                return MSG.onError(99999)
            }else {
                console.log(result);
                return MSG.onSuccess(200)
            }
        }
    }

    //인증번호 가져오기
    async getAuthNumber (authnumber){
        const result = await run_prisma(
            prisma.rs_mem_auth.findMany({
                where:{
                    authNumber: Number(authnumber)
                }
            })
        )
        if(result.successful === false){
            console.log(result)
            return result
        }else{
            return MSG.onSuccess(200)
        }
    }

    // 비밀번호 초기화 
    async resetPassword(auth_email){
        const result = await run_prisma(
            prisma.rs_member.update({
                where:{
                    mem_email:auth_email
                },
                data:{
                    mem_userpw:sha256( 1111 + auth_email)
                }
            })
        )
        if(result.successful === false){
            console.log(result);
            return MSG.onError(99999)
        } else {
            return MSG.onSuccess(200)
        }
    }
    // 로그아웃(refresh token 삭제)
    async logoutUser(email){
        const result = await run_prisma(
            prisma.rs_mem_token.deleteMany({
                where:{
                    mtk_email:email
                }
            })
        )
        if(result.successful ===true){
            if(result.data.count === 0 ){
                console.log(result);
                return MSG.onError(99999)
            }else {
                console.log(result);
                return MSG.onSuccess(200)
            }
        }
    }
}


module.exports = new Test();
