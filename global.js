import axios from 'axios'

/**
 * 字符串工具
 * @type {{readUTF: (function(*=): string)}}
 */
const $StringUtils = {
  /**
   * utf-8转字符串
   * @param code
   * @returns {string}
   */
  readUTF: (code) => {
    return decodeURI(code)
  }
};

/**
 * 时间工具
 * @type {{dateFormat: (function(*, *=): *), addDate: (function(*, *=): Date)}}
 */
const $dateUtils = {
  /**
   * 加天数,可以传负值
   * @param days
   * @param date
   * @returns {Date}
   */
  addDate: (days, date = new Date()) => {
    let newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  },

  dateFormat: (date, fmt) => {
    let o = {
      "M+": date.getMonth() + 1,                 //月份
      "d+": date.getDate(),                    //日
      "h+": date.getHours(),                   //小时
      "m+": date.getMinutes(),                 //分
      "s+": date.getSeconds(),                 //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
};

/**
 * localStorage
 * @type {{getUserType: (function(): string), setToken: (function(*=): void), removeToken: (function(): void), getToken: (function(): string), setUserType: (function(*=): void), removeUserId: (function(): void), removeUserType: (function(): void), getUserId: (function(): string), setUserId: (function(*=): void)}}
 */
const $ls = {
  getToken: () => {
    return localStorage.getItem(window.configs.TOKEN);
  },

  setToken: (token) => {
    return localStorage.setItem(window.configs.TOKEN, token);
  },

  removeToken: () => {
    return localStorage.removeItem(window.configs.TOKEN);
  },

  getUserId: () => {
    return localStorage.getItem(window.configs.USER_ID);
  },

  setUserId: (userId) => {
    return localStorage.setItem(window.configs.USER_ID, userId);
  },

  removeUserId: () => {
    return localStorage.removeItem(window.configs.USER_ID);
  },

  getUserType: () => {
    return localStorage.getItem(window.configs.USER_TYPE)
  },

  setUserType: (userType) => {
    return localStorage.setItem(window.configs.USER_TYPE, userType)
  },

  removeUserType: () => {
    return localStorage.removeItem(window.configs.USER_TYPE)
  },
};

/**
 * 文件下载
 * @param url
 * @param type 默认  application/vnd.ms-excel
 * @param requestBody 默认{} 因为默认get请求所有没有请求体传参
 * @param method 默认 get 请求
 */
const $download = (url, type = 'application/vnd.ms-excel', requestBody = {}, method = 'get') => {
  axios({
    method: method,
    url: url,
    // headers里面设置token
    headers: {
      Authorization: $ls.getToken()
    },
    data: requestBody,
    // 二进制流文件，一定要设置成blob，默认是json
    responseType: 'blob'
  }).then(res => {
    const link = document.createElement('a');
    const blob = new Blob([res.data], {type: type});
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    //从后台获取excel文件，后台必须有对应的设置响应对象
    // response.setHeader("Access-Control-Expose-Headers", "Content-disposition");
    let filename = res.headers['filename'];
    filename = $StringUtils.readUTF(filename);
    link.download = `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }).catch(error => {
    console.error(error);
  });
};

/**
 * 文件上传 element-ui
 * @param url
 * @param file element-ui=> el-upload =>http-request
 */
const $upload = (url, file, successCallback) => {
  let form = new FormData(); // FormData 对象
  form.append("file", file.file); // 文件对象
  axios({
    url: url,
    headers: {
      Authorization: $ls.getToken()
    },
    method: 'post',                 //上传方式
    data: form,                   // 上传formdata封装的数据
    dataType: 'JSON',
  }).then(response=>{
    if (successCallback) {
      successCallback(response.data);
    }
  })
};

export default {
  $download,
  $upload,
  $dateUtils,
  $StringUtils,
  $ls
}
