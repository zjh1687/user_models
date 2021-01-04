"use strict";
// JWT Configsmodule.exports =

// const SMARTFARM_TTAK_KO_COFNIG = require("../Models/SmartFarm_TTAK_KO/config");

const SERVER_VERIFY_INFO = {
    access: {
        name: "RS_AST",
        secret_key: "$RsSrTeEpAoMlDeEvVeEdLmOaPeEsRrS:AcCeSs20020320:STPREPOLEVED",
        expire: "2h", //1m , 1h, 1d, 1y
        issuer: "rsteam_developers",
        subject: "access_token_test",
    },
    refresh: {
        name: "RS_RFT",
        secret_key: "$RsSrTeEpAoMlDeEvVeEdLmOaPeEsRrS:ReFrAsH20020320:STPREPOLEVED",
        expire: "1d",
        issuer: "rsteam_developers",
        subject: "refresh_token_test",
    },
};

const SERVER_HTTP_PORT = 3999;
const SERVER_HTTPS_PORT = 4000;
var SERVER_INFO = {
    name: "Node Simulator",
    version: "v0.1",
    description: "virtual Sensor Node Simulator",
    state: -1,
    startdate: 0,
};

module.exports = {
    SERVER_VERIFY_INFO,
    SERVER_INFO,
    SERVER_HTTP_PORT,
    SERVER_HTTPS_PORT,
    // SMARTFARM_TTAK_KO_COFNIG,
};
