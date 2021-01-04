const { PrismaClient } = require("@prisma/client");
const MSG = require("./Messages_Models");
const prisma = new PrismaClient();
async function run_prisma(attempt) {
    try {
        let res = await attempt;
        return MSG.onSuccess(0, res);
    } catch (err) {
        console.log(err);
        return MSG.onError(err.code, err.meta);
    }
}
module.exports = { prisma, run_prisma };
