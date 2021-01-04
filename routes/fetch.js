import axios from "axios";

const axiosOptions = {
    // `url` is the server URL that will be used for the request
    url: "/info",

    // `method` is the request method to be used when making the request
    method: "GET", // default

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: "http://localhost:2999",

    // `transformRequest` allows changes to the request data before it is sent to the server
    // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
    // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
    // FormData or Stream
    // You may modify the headers object.
    // transformRequest: [
    //     function (data, headers) {
    //         // Do whatever you want to transform the data

    //         return data;
    //     },
    // ],

    // `transformResponse` allows changes to the response data to be made before
    // it is passed to then/catch
    // transformResponse: [
    //     function (data) {
    //         // Do whatever you want to transform the data

    //         return data;
    //     },
    // ],

    // `headers` are custom headers to be sent
    headers: { "rs-access-token": sessionStorage.getItem("RS_AST") },

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    // params: {
    //     ID: 12345,
    // },

    // `paramsSerializer` is an optional function in charge of serializing `params`
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    // paramsSerializer: function (params) {
    //     return Qs.stringify(params, { arrayFormat: "brackets" });
    // },

    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream, Buffer
    data: {},

    // syntax alternative to send data into the body
    // method post
    // only the value is sent, not the key
    //data: "Country=Brasil&City=Belo Horizonte",

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: 5000, // default is `0` (no timeout)

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: true, // default

    // `adapter` allows custom handling of requests which makes testing easier.
    // Return a promise and supply a valid response (see lib/adapters/README.md).
    // adapter: function (config) {
    //     /* ... */
    // },

    // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
    // This will set an `Authorization` header, overwriting any existing
    // `Authorization` custom headers you have set using `headers`.
    // Please note that only HTTP Basic auth is configurable through this parameter.
    // For Bearer tokens and such, use `Authorization` custom headers instead.
    // auth: {
    //     username: "janedoe",
    //     password: "s00pers3cret",
    // },

    // `responseType` indicates the type of data that the server will respond with
    // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
    //   browser only: 'blob'
    responseType: "json", // default

    // `responseEncoding` indicates encoding to use for decoding responses (Node.js only)
    // Note: Ignored for `responseType` of 'stream' or client-side requests
    responseEncoding: "utf8", // default

    // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
    //xsrfCookieName: "XSRF-TOKEN", // default

    // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
    //xsrfHeaderName: "X-XSRF-TOKEN", // default

    // `onUploadProgress` allows handling of progress events for uploads
    // browser only
    onUploadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
    },

    // `onDownloadProgress` allows handling of progress events for downloads
    // browser only
    onDownloadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
    },

    // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
    //maxContentLength: 2000,

    // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
    //maxBodyLength: 2000,

    // `validateStatus` defines whether to resolve or reject the promise for a given
    // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
    // or `undefined`), the promise will be resolved; otherwise, the promise will be
    // rejected.
    validateStatus: function (status) {
        //return status >= 200 && status < 400; // default
        return true; // default
    },

    // `maxRedirects` defines the maximum number of redirects to follow in node.js.
    // If set to 0, no redirects will be followed.
    maxRedirects: 5, // default

    // `socketPath` defines a UNIX Socket to be used in node.js.
    // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
    // Only either `socketPath` or `proxy` can be specified.
    // If both are specified, `socketPath` is used.
    socketPath: null, // default

    // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
    // and https requests, respectively, in node.js. This allows options to be added like
    // `keepAlive` that are not enabled by default.
    // httpAgent: new http.Agent({ keepAlive: true }),
    // httpsAgent: new https.Agent({ keepAlive: true }),

    // `proxy` defines the hostname and port of the proxy server.
    // You can also define your proxy using the conventional `http_proxy` and
    // `https_proxy` environment variables. If you are using environment variables
    // for your proxy configuration, you can also define a `no_proxy` environment
    // variable as a comma-separated list of domains that should not be proxied.
    // Use `false` to disable proxies, ignoring environment variables.
    // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
    // supplies credentials.
    // This will set an `Proxy-Authorization` header, overwriting any existing
    // `Proxy-Authorization` custom headers you have set using `headers`.
    // proxy: {
    //     host: "127.0.0.1",
    //     port: 9000,
    //     auth: {
    //         username: "mikeymike",
    //         password: "rapunz3l",
    //     },
    // },

    // `cancelToken` specifies a cancel token that can be used to cancel the request
    // (see Cancellation section below for details)
    //cancelToken: new CancelToken(function (cancel) {}),

    // `decompress` indicates whether or not the response body should be decompressed
    // automatically. If set to `true` will also remove the 'content-encoding' header
    // from the responses objects of all decompressed responses
    // - Node only (XHR cannot turn off decompression)
    decompress: true, // default
};

export const instance = axios.create(axiosOptions);

export const request = async (method, url, header = null, data = {}) => {
    let result = null;

    if (header) {
        //options.headers = { "rs-access-token": "-----N/A-----" };
        axiosOptions.headers = header;
    }
    axiosOptions.method = method;
    axiosOptions.url = url;
    axiosOptions.data = data;

    await instance(axiosOptions)
        .then(function (res) {
            result = res;
        })
        .catch(function (err) {
            const e = err.toJSON();
            result = {
                error: e,
                config: e.config,
                status: 0,
                statusText: "Error",
            };

            if (err.message.indexOf("Network Error") > -1) {
                result.status = 0;
                result.statusText = "Network Error";
            }
            if (err.message.indexOf("timeout") > -1) {
                result.status = 4408;
                result.statusText = "Request Timeout";
                // instance("/info")
                //     .then(res => {
                //         console.log(res);
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     });
            }
        });

    if (result.data.code === 13103) {
        axiosOptions.headers = { "rs-refresh-token": sessionStorage.getItem("RS_RFT") };
        axiosOptions.method = method;
        axiosOptions.url = "/account/reissue";
        axiosOptions.data = null;

        const reissue_result = await instance(axiosOptions);

        switch (reissue_result.data.code) {
            case 13100: {
                //Access Token 재발급 저장
                sessionStorage.removeItem(reissue_result.data.data.accessName);
                sessionStorage.setItem(reissue_result.data.data.accessName, reissue_result.data.data.accessToken);
                //재시도
                axiosOptions.headers = { "rs-access-token": sessionStorage.getItem("RS_AST") };
                axiosOptions.method = method;
                axiosOptions.url = url;
                axiosOptions.data = data;
                return await instance(axiosOptions);
            }

            case 13104: {
                //logout
                await sessionStorage.removeItem("RS_AST");
                await sessionStorage.removeItem("RS_RFT");

                window.location.href = "/";
                alert("잘못된 세션 또는 다른곳에서 접속하여 로그아웃 됩니다.");
                break;
            }
            default: {
                //logout
                await sessionStorage.removeItem("RS_AST");
                await sessionStorage.removeItem("RS_RFT");
                window.location.href = "/";
                // alert("사용자 토큰이 유효하지 않습니다.");
                return reissue_result;
            }
        }
    }
    return result;
};
