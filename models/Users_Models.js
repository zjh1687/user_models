//const mdbConn   = require('./db_Models');
const e = require("express");
const sha256 = require("sha256");
const mdbConn = require("./mariadb_Models");
const MSG = require("./Messages_Models");

class Users {
    _generateAPI_Key(str) {
        const hrtime = process.hrtime();
        const milliSeconds = String(parseInt(hrtime[0] * 1e3 + hrtime[1] * 1e-6));
        return sha256(str + milliSeconds);
    }

    /**
     * 유저의 모든 카운트
     */
    count = async () => {
        return await mdbConn
            ._query(
                `
            SELECT COUNT(usr_idx) AS count FROM RS_USERS;
        `
            )
            .then((result) => {
                return result;
            });
    };

    /**
     *
     * @param {string} email 유저이메일
     * @param {boolean} deletion = false 삭제 처리된 유저 찾기 여부
     */
    find_Email = async (email, all = false) => {
        if (!email) {
            throw new Error("E-mail, UserName exists");
        } else {
            return await mdbConn
                ._query(
                    `SELECT 
                        usr_idx as idx,
                        usr_access_auth as access_level,
                        usr_api_key as api_key,
                        usr_email as email,
                        usr_username as username,
                        usr_telverify as telverify,
                        usr_tel0 as tel0,
                        usr_tel1 as tel1,
                        usr_address0 as address0,
                        usr_address1 as address1,
                        usr_thumnail as thumnail,
                        usr_access_ip as access_ip,
                        usr_verify as verify,
                        usr_signFcnt as signFcnt,
                        usr_cdate as cdate,
                        usr_mdate as mdate,
                        usr_wdate as wdate,
                        usr_deletion as deletion
                    FROM
                        RS_USERS 
                    WHERE
                        usr_email = ?
                        ${all ? "" : " AND usr_deletion = 0"};`,
                    [email]
                )
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw MSG.onError(1, new Error(err));
                });
        }
    };

    /**
     *
     * @param {string} email 계정이메일
     * @param {string} username 유저 이름
     * @param {string} password 계정 비밀번호 키
     * @param {number} access_auth 계정 접근 권한 레벨
     * @param {number} verify 계정 승인 여부
     * @param {number} signFcnt 계정 로그인 실패 한도
     */

    create = async (email, username, password, access_auth, verify, signFcnt) => {
        if (!email || !username) {
            throw new Error("E-mail, UserName exists");
        } else {
            return await mdbConn
                ._query(
                    `INSERT INTO RS_USERS(usr_email, usr_username, usr_password, usr_api_key, usr_access_auth, usr_verify, usr_signFcnt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [email, username, sha256(password + email), this._generateAPI_Key(email), access_auth, verify, signFcnt]
                )
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw MSG.onError(1, new Error(err));
                });
        }
    };

    /**
     * 유저 삭제 여부
     * @param {string} email
     * @param {int} deletion 1 : 삭제하기 [default]  0 : 삭제된 유저 되살리기
     */
    delete = async (email, deletion = 1) => {
        mdbConn
            ._query(
                `UPDATE RS_USERS 
                    SET usr_deletion = ? 
                    WHERE usr_email = ?;`,
                [deletion, email]
            )
            .then((result) => {
                if (result.successful && result.data.affectedRows === 1) {
                    return result;
                }

                return null;
            })
            .catch((err) => {
                let code = deletion ? 12031 : 12034;
                throw MSG.onError(code, new Error(err));
            });
    };

    /**
     * 유저 정보 업데이트
     * @param {object} data
     */
    update = async (data) => {
        if (!data || typeof data.email === undefined) return MSG.onError(12041, null);

        const valueArr = [];
        const { email, username, address0, address1, tel0, tel1, access_ip, password, telverify } = data;

        let strSetValues = "";

        if (username !== undefined) {
            valueArr[valueArr.length] = username;
            strSetValues += `usr_username = ?,`;
        }
        if (address0 !== undefined) {
            valueArr[valueArr.length] = address0;
            strSetValues += `usr_address0 = ?,`;
        }
        if (address1 !== undefined) {
            valueArr[valueArr.length] = address1;
            strSetValues += `usr_address1 = ?,`;
        }
        if (tel0 !== undefined) {
            valueArr[valueArr.length] = tel0;
            strSetValues += `usr_tel0 = ?,`;
        }
        if (tel1 !== undefined) {
            valueArr[valueArr.length] = tel1;
            strSetValues += `usr_tel1 = ?,`;
        }
        if (access_ip !== undefined) {
            valueArr[valueArr.length] = access_ip;
            strSetValues += `usr_access_ip = ?,`;
        }
        if (password !== undefined) {
            valueArr[valueArr.length] = sha256(password + email);
            strSetValues += `usr_password = ?,`;
        }
        if (telverify !== undefined) {
            valueArr[valueArr.length] = telverify;
            strSetValues += `usr_telverify = ?,`;
        }

        strSetValues += `usr_mdate = NOW()`;
        //strSetValues = strSetValues.slice(0, -1);

        const strQuery = `UPDATE RS_USERS
                SET 
                    ${strSetValues}
                WHERE
                    usr_email = ?`;

        valueArr[valueArr.length] = email;

        return mdbConn
            ._query(strQuery, valueArr)
            .then(async (result) => {
                if (result.successful && result.data.affectedRows === 1) {
                    return MSG.onSuccess(12040, result.data);

                    //업데이트된 정보 가져오기
                    // const result2 = await this.find_Email(email, true);
                    // if (result2.successful) {
                    //     return MSG.onSuccess(12040, result2.data[0]);
                    // }
                }
                return MSG.onError(12041, result);
            })
            .catch((err) => {
                throw MSG.onError(12041, new Error(err));
            });
    };

    /**
     * 유저가 설정한 접속 IP와 현재 접속한 IP 비교
     * @param {string} connect_ip 현재 접속한 유저 IP
     * @param {string} userset_ip 유저가 설정한 IP
     */
    verify_ip = async (connect_ip, userset_ip) => {
        let result = true;
        //Express req.ip에서 connect_ip 주소 스트링이 "::ffff:xxx.xxx.xxx.xxx"로 들어온다
        let cip = connect_ip.split(":").pop().split(".");
        let uip = userset_ip.split(".");

        for (let i = 0; i < cip.length; ++i) {
            if (uip[i] === "*" || uip[i] === undefined) continue;
            if (cip[i] !== uip[i]) {
                result = false;
            }
        }
        return result ? MSG.onSuccess(15000) : MSG.onError(15001);
    };

    /**
     * 유저 로그인 확인
     * @param {string} email
     * @param {string} password
     */
    verify_user = async (email, password) => {
        if (!email || !password) {
            return MSG.onError(11010);
        }

        const user = await mdbConn
            ._query(
                `
            SELECT 
                usr_idx as idx,
                usr_access_auth as access_level,
                usr_api_key as api_key,
                usr_email as email,
                usr_password as password,
                usr_username as username,
                usr_telverify as telverify,
                usr_tel0 as tel0,
                usr_tel1 as tel1,
                usr_address0 as address0,
                usr_address1 as address1,
                usr_thumnail as thumnail,
                usr_access_ip as access_ip,
                usr_verify as verify,
                usr_signFcnt as signFcnt,
                usr_cdate as cdate,
                usr_mdate as mdate,
                usr_wdate as wdate,
                usr_deletion as deletion
            FROM RS_USERS
            WHERE usr_email = ?
                AND usr_deletion = 0;`,
                [email]
            )
            .then((result) => {
                if (result.data.length <= 0) {
                    return false;
                }
                return result;
            })
            .catch((err) => {
                throw MSG.onError(1, new Error(err));
            });

        //유저 없음
        if (!user) {
            return MSG.onError(12011);
        }

        const userinfo = user.data[0];

        //패스워드 비교
        if (userinfo.password !== sha256(password + email)) {
            return MSG.onError(12012);
        }

        //계정 승인여부 확인 관리자는 계정 승인여부 상관 없음
        if (userinfo.access_level < 999) {
            //계정 승인여부 확인
            if (userinfo.verify === 0) {
                return MSG.onError(12013);
            }

            //연속 접근 실패
            if (userinfo.signFcnt <= 0) {
                return MSG.onError(12014);
            }

            //유저 그룹 할당 안됨
            // if (userinfo.section === 0) {
            //     return MSG.onError(12015);
            // }
        }

        //접속 성공
        return MSG.onSuccess(12000, userinfo);
    };

    /**
     * 리프레시 토큰 등록
     * 중복 로그인을 방지하기 위한 기능
     * @param {string} email
     * @param {string} password
     * @param {string} refresh_token
     */
    setRefreshToken = async (email, password, refresh_token) => {
        if (!email || !password || !refresh_token) {
            throw new Error("E-mail, Password refresh_token exists");
        } else {
            return await mdbConn
                ._query(
                    `UPDATE RS_USERS
                SET usr_refresh_token = ?
                WHERE usr_email = ?
                    AND usr_password = ?
                    AND usr_deletion = 0;`,
                    [refresh_token, email, sha256(password + email)]
                )
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw MSG.onError(1, new Error(err));
                });
        }
    };

    /**
     * 리프레시 토큰 주인 확인
     * @param {string} refresh_token
     */
    getTokenOwner = async (refresh_token) => {
        if (!refresh_token) {
            throw new Error("refresh_token");
        } else {
            return await mdbConn
                ._query(
                    `
                SELECT *
                FROM RS_USERS
                WHERE usr_refresh_token = ?
                    AND usr_deletion = 0;`,
                    [refresh_token]
                )
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw MSG.onError(1, new Error(err));
                });
        }
    };

    /**
     * API Key 재발급
     * @param {string} email
     */
    reissuedAPIKey = (email) => {
        const newAPIKey = this._generateAPI_Key(email);
        return mdbConn
            ._query(
                `UPDATE RS_USERS 
                    SET usr_api_key = ? 
                    WHERE usr_email = ?
                        AND usr_deletion = 0;`,
                [newAPIKey, email]
            )
            .then((result) => {
                if (result.successful && result.data.affectedRows === 1) {
                    return newAPIKey;
                }

                return null;
            })
            .catch((err) => {
                throw MSG.onError(16001, new Error(err));
            });
    };

    list = async (deletion = true) => {
        return await mdbConn
            ._query(
                `
                SELECT *
                FROM RS_USERS
                ${deletion && "WHERE usr_deletion = 0;"}`
            )
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw MSG.onError(1, new Error(err));
            });
    };

    list_all = async () => {
        return await mdbConn
            ._query(
                `
                SELECT *
                FROM RS_USERS;`
            )
            .then((result) => {
                return result;
            })
            .catch((err) => {
                throw MSG.onError(1, new Error(err));
            });
    };

    test = async () => {
        return await mdbConn._query(`
        SELECT *
        FROM RS_USE_RS ;`);
    };
}

module.exports = new Users();
