<template>
  <div id="app">
    <img alt="Vue logo" :src="imgUrl" @click="fn">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import imgUrl from './assets/logo.png'
export default {
  name: 'App',
  data () {
    return {
      imgUrl
    }
  },
  methods: {
    fn () {}
  },
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
