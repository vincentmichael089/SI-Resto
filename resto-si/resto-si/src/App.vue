<template>
  <div id="app">
    <TheNav/>
    <router-view/>
  </div>
</template>

<script>
import TheNav from '@/components/TheNav'

export default {
  components: {
    TheNav
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.box-shadow{
  box-shadow: 0 2px 8px 0 rgba(0,0,0,.15);
}
</style>
