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
      <template v-slot:header><strong>Total Pemasukan Hari Ini: Rp {{dailyIncome}}</strong></template>
      <!-- Table -->
        <b-table
          show-empty
          fixed
          small
          bordered
          hover
          head-variant="light"
          sticky-header="400px"
          :items="transactions"
          :fields="fields"
          :busy="isBusy"
        >
          <template v-slot:cell(timestamp)="data">
            <AppDate v-bind:date="data.item.timestamp" v-bind:lastEditAt="data.item.lastEditAt"/>
          </template>
          <template v-slot:cell(actions)="row">
            <b-button variant="info" size="sm" 
              @click="setEditModal(row.item, row.index, $event.target)" class="mr-1">
              <font-awesome-icon :icon="icoSearch"/>
            </b-button>
            <b-button variant="warning" size="sm" 
              @click="setEditModal(row.item, row.index, $event.target)" class="mr-1">
              <font-awesome-icon :icon="icoEdit"/>
            </b-button>
            <b-button variant="danger" size="sm" 
              @click="setDeleteModal(row.item, row.index, $event.target)">
              <font-awesome-icon :icon="icoTrash"/>
            </b-button>
          </template>
           <template v-slot:table-busy>
            <div class="text-center text-secondary my-2">
              <b-spinner variant="secondary" class="align-middle"></b-spinner>
              <strong>Memuat...</strong>
            </div>
          </template>
        </b-table>
    </b-card>
  </div>
</template>

<script>
import { faPlusSquare, faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Cashier',
  data(){
    return{
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc' },
        { key: 'timestamp', label: 'Tanggal Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc'},
        { key: 'income', label: 'Pemasukan', class: 'text-center', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: '', class: 'text-center' },
      ],
      // busy indicator
      isBusy: true,
    }
  },
  computed: {
    transactions(){
      return [...Object.values(this.$store.state.transactions.items)].map(transaction => {
        let sum = 0;
        const transactionItems = [...Object.values(transaction.items)]
        transactionItems.forEach(item => {
          sum += item.qty * item.price
        });
        return { 
          key: transaction['.key'],
          transactionId: transaction.cashier.toString().concat(`-${transaction.tableNumber.toString()}`.concat(transaction['.key'].toString())),
          cashier: transaction.cashier,
          tableNumber: transaction.tableNumber,
          timestamp: transaction.timestamp,
          lastEditAt:transaction.lastEditAt,
          transactionItems: transactionItems,
          income: sum
        }
      })
    },
    dailyIncome(){
      let dailyIncome = 0;
      [...Object.values(this.$store.state.transactions.items)].map(transaction => {
        const transactionItems = [...Object.values(transaction.items)]
        transactionItems.forEach(item => {
          dailyIncome += item.qty * item.price
        });
      })
      return dailyIncome
    },
    menus(){
      return Object.values(this.$store.state.menus.items)
    },
    // icon loader
    icoPlus(){
      return faPlusSquare
    },
    icoSearch(){
      return faSearch
    },
    icoEdit(){
      return faPen
    },
    icoTrash(){
      return faTrash
    },
  },
  methods: {

  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus')
    this.$store.dispatch('transactions/fetchAllTransactions').then(() => {
      this.isBusy = false
    })
  }
}

// transaction id, transaction details, income from transactions
// gives daily income as caption on top right of table
</script>

<style>

</style>