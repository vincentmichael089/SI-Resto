<template>
  <div class="home">
    <div style="margin: 1rem;">
      <h4>Beranda</h4>
      <div class="row col">
        <div class="col-md-6 p-3">
           <div style="height: 200px; width: 100%; background-color: green" class="box-shadow"></div>
        </div>
        <div class="col-md-6 p-3">
           <div style="height: 200px; width: 100%; background-color: green" class="box-shadow" :to="{ name: 'CashierTransactionActive' }"></div>
        </div>
        <div class="col-md-6 p-3">
           <div style="height: 200px; width: 100%; background-color: green" class="box-shadow"></div>
        </div>
        <div class="col-md-6 p-3">
           <div style="height: 200px; width: 100%; background-color: green" class="box-shadow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Home',
  components: {
  },
  computed: {
    home(){
      return faHome
    }
  }
}
</script>
