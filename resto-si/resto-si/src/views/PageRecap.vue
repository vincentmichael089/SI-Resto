<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Rekapitulasi</h4>
    </div>

    <b-card  
      header-tag="header"  
      style="margin: 1rem;"
      class="mb-2 ">
      <template v-slot:header>
        <b-col class="my-1 pl-0 mr-0"><strong>Total Pemasukan: {{dailyIncome}}</strong></b-col>
        <b-row>
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Rentang waktu"
              label-cols-lg="3"
              label-align-lg="right"
              label-size="sm"
              label-for="initialSortSelect"
              class="mb-0"
            >
              <b-form-select
                @change="getTransactionsInTimeSpan()"
                v-model="timeFlag"
                id="initialSortSelect"
                size="sm"
                :options="timeOptions"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <!-- Search bar -->
          <b-col lg="6" class="my-1">  
            <b-form-group
              label='ID Transaksi'
              label-cols-lg="3"
              label-align-lg="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  placeholder="Cari ID transaksi..."
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </template>

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
        :busy="isBusy"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :filter="filter"
        :filterIncludedFields="filterOn"
      >
        <template v-slot:cell(timestamp)="data">
          <AppDate :date="data.item.timestamp" :lastEditAt="data.item.lastEditAt" :dateFormat="true"/>
        </template>
        <template v-slot:cell(actions)="row">
          <b-button variant="info" size="sm" 
            @click="setInfoModal(row.item, row.index, $event.target)" class="mr-1">
            <font-awesome-icon :icon="icoPeek"/>
          </b-button>
        </template>
          <template v-slot:table-busy>
          <div class="text-center text-secondary my-2 p-3">
            <div class="col"><b-spinner variant="secondary" class="align-middle"></b-spinner></div>
            <div class="col"><strong>Memuat...</strong></div>
          </div>
        </template>
        <template v-slot:empty><div class="text-center col p-3">Transaksi tidak ditemukan</div></template>
        <template v-slot:emptyfiltered><div class="text-center col p-3">ID Transaksi tidak ditemukan</div></template>
      </b-table>

      <!-- Info Transaction Modal -->
      <b-modal 
        :id="infoTransactionModal.id"  
        button-size="sm"
        scrollable
        centered
        size="md"
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        <div>
          <strong>Keterangan</strong>
          <div class="col pt-2">
            <table>
              <tr>
                <td class="mr-2">Waktu Transaksi</td>
                <td></td>
                <td>{{toHumaneDate(infoTransactionModal.content.timestamp)}}</td>
              </tr>
              <tr>
                <td class="mr-2">Kasir</td>
                <td></td>
                <td>{{infoTransactionModal.content.cashier}}</td>
              </tr>
              <tr>
                <td class="mr-2">Nomor Meja</td>
                <td></td>
                <td>{{infoTransactionModal.content.tableNumber}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="pt-4"/>
        <div>
          <strong>Rincian Order</strong>
          <div class="col pt-2">
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
        <template v-slot:modal-header="{ close }">
          <div class="col pt-2 pl-2"><h5 class="pb-0 mb-0">{{infoTransactionModal.title}}</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="close()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" @click="ok()">Tutup</b-button>
        </template>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import { faPlusSquare, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import valueFormatter from '@/mixins/valueFormatter'

export default {
  name: 'Recap',
  mixins: [valueFormatter],
  data(){
    return{
      editFlag: true,
      timeFlag: 1,
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true },
        { key: 'timestamp', label: 'Waktu Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc', filterByFormatted: true},
        { key: 'income', label: 'Pemasukan', class: 'text-center', sortable: true },
        { key: 'actions', label: '', class: 'text-center' },
      ],
      timeOptions: [
        { value: null, text: '-- Pilih rentang waktu--' },
        { value: 0, text: 'Hari ini' },
        { value: 1, text: '1 Minggu terakhir' },
        { value: 2, text: '1 Bulan terakhir' },
        { value: 3, text: '3 Bulan terakhir' },
        { value: 4, text: '6 Bulan terakhir' },
        { value: 5, text: '1 Tahun terakhir' }
      ],
      // busy indicator
      isBusy: true,
      // filter
      filter: null,
      filterMenu: null,
      filterOn: ["transactionId", "timestamp"],
      // sort
      sortBy: 'timestamp',
      sortDesc: true,
      // modals
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

        if(transaction.items){
          [...Object.values(transaction.items)].forEach(item => {
            sum += item.qty * item.price
          });
        }
        
        return { 
          key: transaction['.key'],
          transactionId: transaction.cashier.toUpperCase().concat(`-${transaction.tableNumber}-`.concat(transaction.timestamp)),
          cashier: transaction.cashier,
          tableNumber: transaction.tableNumber,
          timestamp: transaction.timestamp,
          lastEditAt:transaction.lastEditAt,
          transactionItems: transaction.items,
          income: this.toCurrencyFormat(sum),
        }
      })
    },
    dailyIncome(){
      let dailyIncome = 0;
      [...Object.values(this.$store.state.transactions.items)].map(transaction => {
        if(transaction.items){
          const transactionItems = [...Object.values(transaction.items)]
          transactionItems.forEach(item => {
            dailyIncome += item.qty * item.price
          });
        }
      })
      return this.toCurrencyFormat(dailyIncome)
    },

    // icon loader
    icoPlus(){
      return faPlusSquare
    },
    icoPeek(){
      return faEye
    },
    icoEdit(){
      return faPen
    },
    icoTrash(){
      return faTrash
    }
  },
  methods: {
    // modals    
    setEditModal(item, index, button){
      if(item !== null && index !== null){
        this.editFlag = true
        this.editTransactionModal.title = `Ubah Transaksi ${item.transactionId}`
        this.editTransactionModal.content.key = item.key
        this.editTransactionModal.content.cashier = item.cashier
        this.editTransactionModal.content.tableNumber = item.tableNumber

        this.$store.dispatch('menus/fetchAllMenusModifiedByTransactionId', item.key)
        this.$root.$emit('bv::show::modal', this.editTransactionModal.id, button)
      }
    },
    setInfoModal(item, index, button){
      this.infoTransactionModal.title = `Rincian Transaksi ${item.transactionId}`
      this.infoTransactionModal.content = item
      this.$root.$emit('bv::show::modal', this.infoTransactionModal.id, button)
    },
    refreshMenuState(){
      this.$store.dispatch('menus/setMenuQtyZero')
    },
    getTransactionsInTimeSpan(){
      this.isBusy = true
      this.$store.dispatch('transactions/fetchTimedTransactions', {flag: this.timeFlag}).then(() => {
        this.isBusy = false
      })
    }
  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus').then(() => {
      this.refreshMenuState()
    })
    this.$store.dispatch('transactions/fetchTimedTransactions', {flag: this.timeFlag}).then(() => {
      this.isBusy = false
    })
  }
}
</script>

<style>

</style>