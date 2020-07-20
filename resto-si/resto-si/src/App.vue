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
@font-face {
  font-family: Barlow-Light;
  src: url("./assets/fonts/Barlow-Light.ttf");
}

@font-face {
  font-family: Barlow-Regular;
  src: url("./assets/fonts/Barlow-Regular.ttf");
}

@font-face {
  font-family: Barlow-Medium;
  src: url("./assets/fonts/Barlow-Medium.ttf");
}

@font-face {
  font-family: Barlow-SemiBold;
  src: url("./assets/fonts/Barlow-SemiBold.ttf");
}

#app {
  font-family: Barlow-Regular;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background: #f1f5f7;
}

h4 {
  font-family: Barlow-SemiBold;
}

button {
  font-family: Barlow-Medium;
}

.button-primary {
  background-color: #05bbc9;
  color: #ffffff;
  border: 0;
}

.button-primary:hover {
  background-color: #03949e;
}

.button-primary:active {
  background-color: #03949e;
}

.f-regular {
  font-family: Barlow-Regular;
}

.f-medium {
  font-family: Barlow-Medium;
}

.f-light {
  font-family: Barlow-Light;
}

.f-semibold {
  font-family: Barlow-SemiBold;
}

.box-shadow{
  box-shadow: 0 2px 8px 0 rgba(0,0,0,.15);
  border-radius: 8px;
}

.note-info {
  border-color: #59c4e4;
  background: #f8ffff;
}

.note {
  margin-bottom: 15px;
  padding: 15px;
  border-left-width: 4px;
  border-left-style: solid;
  border-color: #59c4e4;
  background: #f8ffff;
}

.card-bg{
  background: #ffffff;
}

.card-header{
  background: #ffffff;
  border: 0;
}

.color-primary{
  background-color: #05bcc923;
}
</style>
