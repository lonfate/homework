<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="content">
      <router-link to="/">index</router-link>
      <router-link to="/detail">detail</router-link>
      <router-link to="/login">login</router-link>
    </div>
    <router-view class="msg"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
    }
  },
  methods: {
    handler() {
      console.log(123)
    }
  }
}
</script>

<style>
.content{
  display: flex;
  justify-content: center;
  margin-bottom: 100px;
}
.content a {
  margin: 0 20px;
}
.msg{
  font-weight: 700;
  font-size: 20px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
