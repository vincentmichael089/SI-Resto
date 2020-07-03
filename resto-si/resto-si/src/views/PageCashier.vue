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
      @click="createTransaction()"><font-awesome-icon :icon="icoPlus"/> Transaksi Baru </b-button>
    </div>
    <b-card  
      header-tag="header"  
      style="margin: 1rem;"
      class="mb-2 ">
      <template v-slot:header><strong>Total Pemasukan Hari Ini: {{dailyIncome}}</strong></template>
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
            @click="setInfoModal(row.item, row.index, $event.target)" class="mr-1">
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
      <!-- Delete Transaction Modal -->
      <b-modal 
        :id="deleteTransactionModal.id" 
        :title="deleteTransactionModal.title" 
        centered button-size="sm"
        size="md"
        okVariant= 'danger'
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        {{ deleteTransactionModal.content.text }}
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="danger" @click="deleteTransaction()">Hapus</b-button>
        </template>
      </b-modal>
      <!-- Info Transaction Modal -->
      <b-modal 
        :id="infoTransactionModal.id" 
        :title="infoTransactionModal.title" 
        button-size="sm"
        scrollable
        centered
        size="md"
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        <div>
          <strong>Keterangan</strong>
          <div class="col">
            <table style="width: 100%;">
              <tr>
                <td>Waktu Transaksi</td>
                <td>{{infoTransactionModal.content.timestamp}}</td>
              </tr>
              <tr>
                <td>Kasir</td>
                <td>{{infoTransactionModal.content.cashier}}</td>
              </tr>
              <tr>
                <td>Nomor Meja</td>
                <td>{{infoTransactionModal.content.tableNumber}}</td>
              </tr>
            </table>
          </div>
        </div>
        <br>
        <div>
          <strong>Rincian Order</strong>
          <div class="col">
            <table style="width: 100%;">
              <tr v-for="item in infoTransactionModal.content.transactionItems" :key="item.key">
                <td>{{item.qty}} x</td>
                <td>{{item.name}}</td>
                <td style="text-align: right;">{{toCurrencyFormat(item.qty * item.price)}}</td>
              </tr>
            </table>
          </div>
        </div>
        <hr>
        <div style="position: relative">
          <div style="position: absolute; right: 5px; top: -10px"><strong>Total: {{infoTransactionModal.content.income}}</strong></div>
        </div>
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" @click="ok()">Tutup</b-button>
        </template>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import { faPlusSquare, faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import currencyFormatter from '@/mixins/currencyFormatter'

export default {
  name: 'Cashier',
  mixins: [currencyFormatter],
  data(){
    return{
      newTransaction: {
        cashier: 'mock',
        items: {
          itemmock1: {
            name: 'mockmenu',
            price: 20000,
            qty: 2,
            typr: 'food'
          }
        },
        tableNumber: '4',
      },
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc' },
        { key: 'timestamp', label: 'Tanggal Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc'},
        { key: 'income', label: 'Pemasukan', class: 'text-center', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: '', class: 'text-center' },
      ],
      // busy indicator
      isBusy: true,
      // modals
      deleteTransactionModal: { 
        id: 'delete-transaction-modal',
        title: '',
        content: {
          id: null,
          text: ''
        }
      },
      infoTransactionModal: {
        id: 'info-transaction-modal',
        title: '',
        content: {}
      }
    }
  },
  computed: {
    transactions(){
      return [...Object.values(this.$store.state.transactions.items)].map(transaction => {
        let sum = 0;
        [...Object.values(transaction.items)].forEach(item => {
          sum += item.qty * item.price
        });
        
        return { 
          key: transaction['.key'],
          transactionId: transaction.cashier.toString().concat(`-${transaction.tableNumber.toString()}-`.concat(transaction.timestamp.toString())),
          cashier: transaction.cashier,
          tableNumber: transaction.tableNumber,
          timestamp: transaction.timestamp,
          lastEditAt:transaction.lastEditAt,
          transactionItems: transaction.items,
          income: this.toCurrencyFormat(sum)
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
      return this.toCurrencyFormat(dailyIncome)
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
    }
  },
  methods: {
    createTransaction(){
      const cashier = this.newTransaction.cashier
      const tableNumber = this.newTransaction.tableNumber
      const items = this.newTransaction.items
      this.newTransaction.cashier = ''
      this.newTransaction.tableNumber = ''
      this.newTransaction.items = ''
      return this.$store.dispatch('transactions/createTransaction', {cashier: cashier, tableNumber: tableNumber, items: items})
    },
    deleteTransaction(){
      return this.$store.dispatch('transactions/deleteTransaction', this.deleteTransactionModal.content.id) 
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.deleteTransactionModal.id)
      })
    },
    // modals
    setInfoModal(item, index, button){
      this.infoTransactionModal.title = `Rincian Transaksi ${item.transactionId}`
      this.infoTransactionModal.content = item
      this.$root.$emit('bv::show::modal', this.infoTransactionModal.id, button)
    },
    setDeleteModal(item, index, button){
      this.deleteTransactionModal.title = `Hapus transaksi ${item.transactionId} ?`
      this.deleteTransactionModal.content.text = `Apakah anda yakin ingin menghapus transaksi ${item.transactionId} ?`
      this.deleteTransactionModal.content.id = item.key
      this.$root.$emit('bv::show::modal', this.deleteTransactionModal.id, button)
    }
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