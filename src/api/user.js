import request from '.';
export function createUser(data) {
  return request.post(`/user`, data);
}
export function getUser(params) {
  return request.get(`/user`, {
    params: params,
  });
}
export function getUserById(id, params) {
  return request.get(`/user/${id}`, {
    params: params,
  });
}
export function updateUserById(id, data) {
  return request.patch(`/user/${id}`, data);
}
export function deleteUserById(id, data) {
  return request.delete(`/user/${id}`, data);
}
export function userTest(data) {
  return request.post(`/user/test`, data);
}
export function userLogin(data) {
  return request.post(`/user/login`, data);
}
