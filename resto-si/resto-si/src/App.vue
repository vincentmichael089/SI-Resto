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

.note-info {
  border-color: #59c4e4;
  background: #f8ffff;
}

.note {
  margin-bottom: 15px;
  padding: 15px;
  border-left-width: 3px;
  border-left-style: solid;
  border-color: #ddd;
  background: #fafafa;
}
</style>
