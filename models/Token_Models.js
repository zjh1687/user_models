var JWT = require("jsonwebtoken");
const MSG = require("./Messages_Models");

class Token {
    constructor() {
        // JWT Configs
        // this.secret = {
        //     access : {
        //     secret_key   : "$RsSrTeEpAoMlDeEvVeEdLmOaPeEsRrS:AcCeSs20020320:STPREPOLEVED",
        //     expire       : "1m",   //1m , 1h, 1d, 1y
        //     issuer       : "rsteam_developers",
        //     subject      : "access_token_test",
        // },
        // refresh : {
        //     secret_key   : "$RsSrTeEpAoMlDeEvVeEdLmOaPeEsRrS:refresh20020320:STPREPOLEVED",
        //     expire       : "3m",
        //     issuer       : "rsteam_developers",
        //     subject      : "refresh_token_test",
        // }
        this.secret = require("../config/config").SERVER_VERIFY_INFO;
        this.blacklist = {
            access_token: [],
            refresh_token: [],
        };
    }

    generateAccessToken = async (publicInfo, key = null, expire = null) => {
        const secret_key = key == null ? this.secret.access.secret_key : key;
        const expiresIn = expire == null ? this.secret.access.expire : expire;

        const p = new Promise((resolve, reject) => {
            JWT.sign(
                publicInfo,
                secret_key,
                {
                    expiresIn: expiresIn,
                    issuer: this.secret.access.issuer,
                    subject: this.secret.access.subject,
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                }
            );
        });

        return p
            .then((token) => {
                return MSG.onSuccess(13100, token);
            })
            .catch((err) => {
                return MSG.onError(13102, err);
            });
    };

    generateRefreshToken = async (publicInfo, key = null, expire = null) => {
        const secret_key = key == null ? this.secret.refresh.secret_key : key;
        const expiresIn = expire == null ? this.secret.refresh.expire : expire;

        const p = new Promise((resolve, reject) => {
            JWT.sign(
                publicInfo,
                secret_key,
                {
                    expiresIn: expiresIn,
                    issuer: this.secret.refresh.issuer,
                    subject: this.secret.refresh.subject,
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                }
            );
        });

        return p
            .then((token) => {
                return MSG.onSuccess(13200, token);
            })
            .catch((err) => {
                return MSG.onError(13202, err);
            });
    };

    verify_access = async (token, key = null) => {
        const secret_key = key == null ? this.secret.access.secret_key : key;

        const p = new Promise((resolve, reject) => {
            JWT.verify(token, secret_key, (err, decode) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decode);
                }
            });
        });
        return p
            .then((decode) => {
                return MSG.onSuccess(13000, decode);
            })
            .catch((err) => {
                this.blacklist.access_token[this.blacklist.access_token.length - 1] = token;
                return MSG.onError(13001, err);
            });
    };

    verify_refresh = async (token, key = null) => {
        const secret_key = key == null ? this.secret.refresh.secret_key : key;

        const p = new Promise((resolve, reject) => {
            JWT.verify(token, secret_key, (err, decode) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decode);
                }
            });
        });
        return p
            .then((decode) => {
                return MSG.onSuccess(13000, decode);
            })
            .catch((err) => {
                this.blacklist.refresh_token[this.blacklist.refresh_token.length - 1] = token;
                return MSG.onError(13001, err);
            });
    };

    addBlacklist = (tokenType, token) => {
        this.blacklist[tokenType][this.blacklist[tokenType].length] = token;
    };

    getBlacklist = () => {
        return this.blacklist;
    };
}

module.exports = new Token();
