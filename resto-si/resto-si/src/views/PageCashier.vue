<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Kasir</h4>
    </div> 
    {{transactions}}
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
  data(){
    return{
      // busy indicator
      isBusy: true,
    }
  },
  computed: {
    transactions(){
      return Object.values(this.$store.state.transactions.items)
    },
    menus(){
      return Object.values(this.$store.state.menus.items)
    },
    // icon loader
    icoPlus(){
      return faPlusSquare
    }
  },
  beforeCreate(){
    this.$store.dispatch('transactions/fetchAllTransactions')
    this.$store.dispatch('menus/fetchAllMenus')
  }
}

// transaction id, transaction details, income from transactions
// gives daily income as caption on top right of table
</script>

<style>

</style>