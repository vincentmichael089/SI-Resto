<template>
  <div>
    <div style="margin: 1rem; padding-top: 8%">
      <div class="row col pt-lg-4">
        <div class="col-md-6 col-sm-0 pt-3 text-center d-none d-sm-block"><div>
          <img src="@/assets/siresto-01.png" alt=""  style="max-width: 450px">  
        </div></div>
        <div class="col-md-6 col-sm-0 pt-3" style="margin: auto">
          <div  style="pt-lg-4 px-3">
            <div class="f-bold" style="font-size: 6.5vh; line-height: 1;">Kasir rumah makan, semakin mudah dan pintar.</div>
            <div class="f-regular pt-2" style="font-size: 4vh; line-height: 1.2">Kasir, Riwayat Transaksi, dan Insight dalam satu aplikasi.</div>
            <div class="p-4 text-center">
              <span>
                <b-button variant="info" class="button-primary f-semibold p-1 m-2 px-4" :to="{ name: 'Login' }">Masuk</b-button>
                <b-button variant="outline-info" class="f-semibold p-1 m-2 px-4" :to="{ name: 'Register' }">Daftar</b-button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  computed: {

  }
}
</script>

<style>
.tab-content{
  margin: 0
}
</style>