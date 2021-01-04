const { prisma, run_prisma } = require("./Prisma_Models");
const moment = require('moment')

const inactived_user = async function(){
    const user_inactive = await run_prisma(
        prisma.rs_member.findMany({
            where:{
                mem_lastlogin_timestamp: {
                    lte:moment().subtract('1','year').unix()
                }
            }
            
        })
    )
    const {mem_email} = user_inactive.data[0]
    const user_inactive_check = await run_prisma(
        prisma.rs_member.updateMany({
            where:{
                mem_email:mem_email
            },
            data:{
                mem_inactive_check: 'inactived'
            }
        })
    )
    //     moment().subtract('1','years').unix()
    // for(const _user of user_inactive.data){
    //     _user
    // }
    console.log(user_inactive)
    // if (condition) {
        
    // }
}

module.exports = {
    inactived_user
}