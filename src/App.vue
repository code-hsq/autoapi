<script setup>
import { reactive } from 'vue';
import { login } from './api/user';

const loginState = reactive({
  userName: '',
  password: '',
});
const handleLogin = async () => {
  const res = await login(loginState);
  console.log(res);
};
</script>

<template>
  <div>
    <input v-model="loginState.userName" placeholder="用户名" />
  </div>
  <div>
    <input v-model="loginState.password" type="password" placeholder="密码" />
  </div>
  <div>
    <button @click="handleLogin">登录</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
