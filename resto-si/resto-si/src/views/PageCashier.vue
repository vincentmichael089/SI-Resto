<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Kasir</h4>
    </div> 
    <!-- Add Transaction -->
    <div class="col">
      <b-button 
      size="sm" 
      variant="success"
      @click="newTransaction()"><font-awesome-icon :icon="icoPlus"/> Transaksi Baru </b-button>
    </div>
    <b-card  
      header-tag="header"  
      style="margin: 1rem;"
      class="mb-2 ">
     <template v-slot:header><strong>Daftar Transaksi</strong></template>  
    </b-card>
  </div>
</template>

<script>
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Cashier',
  computed: {
    // icon loader
    icoPlus(){
      return faPlusSquare
    }
  }
}
</script>

<style>

</style>