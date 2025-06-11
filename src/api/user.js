import request from '.';

export const login = (data) => {
  return request.post('/user/login', data);
};
