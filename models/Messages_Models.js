class Messages {
    constructor() {
        this.obj = {
            successful: false,
            code: -1,
            msg: "Unassigned code",
            data: null,
        };
    }

    onSuccess = (code = 0, data = null) => {
        return (this.obj = {
            successful: true,
            code: code,
            msg: this.CODE[code] == undefined ? "Unassigned code" : this.CODE[code],
            data: data,
        });
    };

    onError = (code = 0, data = null) => {
        return (this.obj = {
            successful: false,
            code: code,
            msg: this.CODE[code] == undefined ? "Unassigned code" : this.CODE[code],
            data: data,
        });
    };

    onCustom = (code = 0, msg = "Unassigned code", data = null) => {
        return (this.obj = {
            successful: false,
            code: code,
            msg: msg,
            data: data,
        });
    };

    CODE = {
        0: "successful",
        //알수 없는 오류
        1: "Unknwon Error",
        //~99 Unassigned

        //100 ~ 599 HTTP State Error Code
        100: "Continue",
        200: "OK",
        300: "Multiple Choices",
        400: "Bad Request",
        500: "Internal Server Error",

        //600 ~ 999 Unassigned
        //1000 ~ 4500  Mariadb or MySQL Error Code
        1000: "ER_HASHCHK",

        // Prisma Error Codes
        // P1000 ~ P1014 - Common
        P1000:
            "Authentication failed against database server at ${database_host}, the provided database credentials for ${database_user} are not valid. Please make sure to provide valid database credentials for the database server at ${database_host}.",
        P1001:
            "Can't reach database server at ${database_host}:${database_port} Please make sure your database server is running at ${database_host}:${database_port}.",
        P1002:
            "The database server at ${database_host}:${database_port} was reached but timed out. Please try again. Please make sure your database server is running at ${database_host}:${database_port}.",
        P1003: "Database ${database_name} does not exist on the database server at ${database_host}:${database_port}.",
        P1008: "Operations timed out after ${time}",
        P1009: "Database ${database_name} already exists on the database server at ${database_host}:${database_port}",
        P1010: "User ${database_user} was denied access on the database ${database_name}",
        P1011: "Error opening a TLS connection: ${message}",
        P1012: "${full_error}",
        P1013: "The provided database string is invalid. ${details}",
        P1014: "The underlying ${kind} for model ${model} does not exist.",
        // P2000 ~ P2022 - Query Engine
        P2000: "The provided value for the column is too long for the column's type. Column: ${column_name}",
        P2001: "The record searched for in the where condition (${model_name}.${argument_name} = ${argument_value}) does not exist",
        P2002: "Unique constraint failed on the ${constraint}",
        P2003: "Foreign key constraint failed on the field: ${field_name}",
        P2004: "A constraint failed on the database: ${database_error}",
        P2005: "The value ${field_value} stored in the database for the field ${field_name} is invalid for the field's type",
        P2006: "The provided value ${field_value} for ${model_name} field ${field_name} is not valid",
        P2007: "Data validation error ${database_error}",
        P2008: "Failed to parse the query ${query_parsing_error} at ${query_position}",
        P2009: "Failed to validate the query ${query_validation_error} at ${query_position}",
        P2010: "Raw query failed. Code: ${code}. Message: ${message}",
        P2011: "Null constraint violation on the ${constraint}",
        P2012: "Missing a required value at ${path}",
        P2013: "Missing the required argument ${argument_name} for field ${field_name} on ${object_name}.",
        P2014:
            "The change you are trying to make would violate the required relation '${relation_name}' between the ${model_a_name} and ${model_b_name} models.",
        P2015: "A related record could not be found. ${details}",
        P2016: "Query interpretation error. ${details}",
        P2017: "The records for relation ${relation_name} between the ${parent_name} and ${child_name} models are not connected.",
        P2018: "The required connected records were not found. ${details}",
        P2019: "Input error. ${details}",
        P2020: "Value out of range for the type. ${details}",
        P2021: "The table ${table} does not exist in the current database.",
        P2022: "The column ${column} does not exist in the current database.",

        // P3000 ~ P3004 - Migration Engine
        P3000: "Failed to create database: ${database_error}",
        P3001: "Migration possible with destructive changes and possible data loss: ${migration_engine_destructive_details}",
        P3002: "The attempted migration was rolled back: ${database_error}",
        P3003:
            "The format of migrations changed, the saved migrations are no longer valid. To solve this problem, please follow the steps at: https://pris.ly/d/migrate#troubleshooting",
        P3004: "The ${database_name} database is a system database, it should not be altered with prisma migrate. Please connect to another database.",

        // P4000 ~ P4002 - Introspection Engine
        P4000: "Introspection operation failed to produce a schema file: ${introspection_error}",
        P4001: "The introspected database was empty: ${connection_string}",
        P4002: "The schema of the introspected database was inconsistent: ${explanation}",

        //10000 ~ Unassigned
        //11000 ~ 11999 회원가입 코드
        11000: "Signup successful",
        11001: "Duplicate Email",

        11010: "Invalid input",
        //12000 ~ 12999 로그인 코드
        12000: "Signin Successful",
        12001: "not Sign in",
        12002: "User does not exist",
        12010: "invalid input",
        12011: "invalid user",
        12012: "invalid password",
        12013: "Not an approved account",
        12014: "this account is blocked",
        12015: "This user has not been assigned a section",

        12020: "Signout Successful",
        12021: "Signout Failed",
        12022: "Signout : Session period has expired.",
        12023: "Signout : Signin from another location",
        //13000 ~ 13999 token Check code
        13000: "Check successful",
        13001: "invalid token",
        //13100 ~ 13199 AccessToken
        13100: "issuance complete AccessToken",
        13101: "issuance faild AccessToken",
        13102: "invalid AccessToken",
        13103: "Access Token period has expired.",
        //13200 ~ 13299 RefreshToken
        13200: "issuance complete RefreshToken",
        13201: "issuance faild RefreshToken",
        13202: "invalid RefreshToken",
        13203: "Refresh Token period has expired.",
        13204: "Refresh Token was discarded due to a new connection.",
        13205: "Refresh Token Missing",
        //13300 ~ 13399 ALL Token
        13300: "issuance complete All Token",

        //14000 ~ 14999 유저 권한 관련 코드
        14000: "permission check successful",
        14001: "permission denide",

        //22000 ~ 22999 API Transmit 관련
        22000: "API send successfully",
        22001: "Not allowed message type",
        22002: "No user found",
        22003: "User is not match with node owner",
        22004: "Not success message received. check {data}",
        22005: "GCG ERROR RETURN check {data}",
        22006: "Probably Network Error or Destination URL Error",
        22007: "There is ErrorLog",

        //23000 ~ 23999 API Receive 관련
        23000: "API received successfully",
        23001: "There is ErrorLog",

        //24000 ~ 25000 USER 관련
        24000: "Success",
        24001: "Invalid input",
    };
}

module.exports = new Messages();
