<template>
   <div class="text-center p-3">
    <h2 class="f-semibold">Whoopsie doopsie!</h2>
    <img src="@/assets/notfound.svg" style="max-height: 300px">
    <h2>Halaman yang kamu cari tidak ditemukan :(</h2>
    <router-link :to="{name: 'Home'}">Kembali ke Beranda</router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>