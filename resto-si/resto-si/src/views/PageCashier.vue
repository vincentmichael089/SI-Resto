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
      <!-- Table -->
        <b-table
          show-empty
          small
          bordered
          hover
          head-variant="light"
          sticky-header="400px"
          :items="transactions"
          :fields="fields"
        >
          <template v-slot:cell(timestamp)="data">
            <AppDate v-bind:date="data.item.timestamp" v-bind:lastEditAt="data.item.lastEditAt"/>
          </template>
        </b-table>
    </b-card>
  </div>
</template>

<script>
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Cashier',
  data(){
    return{
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc' },
        { key: 'timestamp', label: 'Tanggal Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc'},
        { key: 'income', label: 'Pemasukan', class: 'text-center', sortable: true, sortDirection: 'desc' },
      ],
      // busy indicator
      isBusy: true,
    }
  },
  computed: {
    transactions(){
      return [...Object.values(this.$store.state.transactions.items)].map(transaction => {
        let sum = 0
        const transactionItems = [...Object.values(transaction.items)]
        transactionItems.forEach(item => {
          sum += item.qty * item.price
        });
        return { 
          key: transaction['.key'],
          transactionId: transaction.cashier.toString().concat(transaction['.key'].toString()),
          cashier: transaction.cashier,
          timestamp: transaction.timestamp,
          lastEditAt:transaction.lastEditAt,
          transactionItems: transactionItems,
          income: sum
        }
      })
    },
    menus(){
      return Object.values(this.$store.state.menus.items)
    },
    // icon loader
    icoPlus(){
      return faPlusSquare
    }
  },
  methods: {

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