import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 3000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers.set('Authorization', token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
