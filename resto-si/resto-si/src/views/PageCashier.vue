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
      @click="setAddModal($event.target)"><font-awesome-icon :icon="icoPlus"/> Transaksi Baru </b-button>
    </div>
    <b-card  
      header-tag="header"  
      style="margin: 1rem;"
      class="mb-2 ">
      <template v-slot:header>
        <b-row>
          <b-col lg="6" class="my-1"><strong>Total Pemasukan Hari Ini: {{dailyIncome}}</strong></b-col>
          <!-- Search bar -->
          <b-col lg="6" class="my-1">  
            <b-form-group
              label='Cari Transaksi'
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
          <AppDate v-bind:date="data.item.timestamp" v-bind:lastEditAt="data.item.lastEditAt"/>
        </template>
        <template v-slot:cell(actions)="row">
          <b-button variant="info" size="sm" 
            @click="setInfoModal(row.item, row.index, $event.target)" class="mr-1">
            <font-awesome-icon :icon="icoPeek"/>
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
          <div class="text-center text-secondary my-2 p-3">
            <div class="col"><b-spinner variant="secondary" class="align-middle"></b-spinner></div>
            <div class="col"><strong>Memuat...</strong></div>
          </div>
        </template>
        <template v-slot:empty><div class="text-center col p-3">Belum ada transaksi hari ini</div></template>
        <template v-slot:emptyfiltered><div class="text-center col p-3">ID Transaksi tidak ditemukan</div></template>

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
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" @click="ok()">Tutup</b-button>
        </template>
      </b-modal>

      <!-- Add Transaction Modal -->
      <b-modal 
        :id="addTransactionModal.id" 
        :title="addTransactionModal.title" 
        button-size="sm"
        scrollable
        centered
        size="lg"
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        <!-- Table Number -->
        <div class="col pb-2">
        <b-row>
          <!-- Table Number -->
          <b-col sm="6" class="my-1"> 
            <b-form-group
              label='Nomor Meja'
              label-cols-lg="3"
              label-align-lg="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="newTransaction.tableNumber"
                  placeholder="nomor meja..."
                ></b-form-input>
              </b-input-group>
            </b-form-group></b-col>
          <!-- Search bar -->
          <b-col sm="6" class="my-1">  
            <b-form-group
              label='Cari Menu'
              label-cols-lg="3"
              label-align-lg="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="filterMenu"
                  type="search"
                  id="filterMenuInput"
                  placeholder="ketik nama menu..."
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        </div>
        <div style="max-height:calc(80vh - 200px)">
          <!-- Table Menu-->
          <b-table
            show-empty
            small
            hover
            borderless
            head-variant="light"
            sticky-header="45vh"
            :items="menus"
            :fields="menusFields"
            :filter="filterMenu"
            :filterIncludedFields="filterMenuOn"
            class="pt-2"
          >
            <template v-slot:cell(qty)="row">
              <b-form-spinbutton id="sb-inline" 
                v-model="row.item.qty" min="0" 
                inline/>
            </template>
            <template v-slot:table-busy>
              <div class="text-center text-secondary my-2 p-3">
                <b-spinner variant="secondary" class="align-middle"></b-spinner>
                <strong>Memuat...</strong>
              </div>
            </template>
            <template v-slot:emptyfiltered><div class="text-center col  p-3">Menu yang dicari tidak ditemukan</div></template>
          </b-table>
          <hr style="margin-bottom: 1vh">
          <table style="width: 100%;" class="col">
            <tr>
              <td style="padding: 0 8px 0 2vh"><strong>Total: {{totalMenus}}</strong></td>
            </tr>
          </table>
        </div>
        <template v-slot:modal-footer>
          <b-button size="sm" variant="danger" @click="cancelTransaction()">Batal</b-button>
          <b-button size="sm" variant="info" v-b-modal.modal-add-transaction-detail>Rincian</b-button>
          <b-button size="sm" variant="success" @click="createTransaction()">Selesai</b-button>
        </template>  
      </b-modal>

      <!-- No Menu Modal -->
      <b-modal id="modal-no-menu" 
        title="Tidak ada menu!" 
        button-size="sm"
        scrollable
        centered
        size="sm"
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
          <div class="text-center col  p-3">Tidak ada menu! Tambahkan menu <span @click="navigateToPageMenu()" style="color: green; cursor: pointer;">disini</span></div>
          <template v-slot:modal-footer="{ cancel }">
            <b-button size="sm" variant="secondary" @click="cancel()">Tutup</b-button>
          </template>
      </b-modal>
        
      <!-- Add Transaction Detail Modal -->
      <b-modal id="modal-add-transaction-detail" 
        title="Rincian Transaksi" 
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
                <td class="mr-4">Kasir</td>
                <td></td>
                <td>{{newTransaction.cashier}}</td>
              </tr>
              <tr>
                <td class="mr-4">Nomor Meja</td>
                <td></td>
                <td>{{newTransaction.tableNumber}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="pt-4"/>
        <div>
          <strong>Rincian Order</strong>
          <div v-if="selectedMenus.length > 0" class="col pt-2">
            <table style="width: 100%;">
              <tr v-for="item in selectedMenus" :key="item.key">
                <td>{{item.qty}} x</td>
                <td>{{item.name}}</td>
                <td style="text-align: right;">{{toCurrencyFormat(item.qty * item.price)}}</td>
              </tr>
            </table>
          </div>
          <div v-else class="col pt-2">Belum ada menu yang ditambahkan</div>
        </div>
        <hr>
        <div style="position: relative">
          <div style="position: absolute; right: 5px; top: -10px"><strong>Total: {{totalMenus}}</strong></div>
        </div>
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
  name: 'Cashier',
  mixins: [valueFormatter],
  data(){
    return{
      newTransaction: {
        cashier: 'mock',
        items: {},
        tableNumber: null,
      },
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true },
        { key: 'timestamp', label: 'Tanggal Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc'},
        { key: 'income', label: 'Pemasukan', class: 'text-center', sortable: true },
        { key: 'actions', label: '', class: 'text-center' },
      ],
      menusFields: [
        { key: 'name', label: 'Menu', class: 'text-center', sortable: true },
        { key: 'type', label: 'Tipe', class: 'text-center', sortable: true, formatter: (value) => {
          return value == 'food' ? 'Makanan' : 'Minuman'
        }},
        { key: 'price', label: 'Harga', class: 'text-center', formatter: this.toCurrencyFormat},
        { key: 'qty', label: 'Porsi', class: 'text-center' }
      ],
      // busy indicator
      isBusy: true,
      // filter
      filter: null,
      filterMenu: null,
      filterOn: ["transactionId"],
      filterMenuOn: ["name"],
      // sort
      sortBy: 'timestamp',
      sortDesc: true,
      // modals
      deleteTransactionModal: { 
        id: 'delete-transaction-modal',
        title: '',
        content: {
          id: null,
          text: ''
        }
      },
      addTransactionModal: { 
        id: 'add-transaction-modal' 
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
        const transactionItems = [...Object.values(transaction.items)]
        transactionItems.forEach(item => {
          dailyIncome += item.qty * item.price
        });
      })
      return this.toCurrencyFormat(dailyIncome)
    },
    menus(){
      return [...Object.values(this.$store.state.menus.items)]
    },
    totalMenus(){
      let totalPrice = 0;
      [...Object.values(this.menus)].map(menu => {
        totalPrice += menu.qty * menu.price
      })
      return this.toCurrencyFormat(totalPrice)
    },
    selectedMenus(){
      return this.menus.filter(menu => menu.qty !== 0).sort((a, b) => (a.type > b.type) ? -1 : 1)
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
    createTransaction(){
      const cashier = this.newTransaction.cashier
      const tableNumber = this.newTransaction.tableNumber
      
      const arrayToObject = (array, keyField) =>
        array.reduce((obj, item) => {
          obj[item[keyField]] = item
          delete obj[item[keyField]]['.key']
          return obj
        }, {})

      const items = arrayToObject(this.selectedMenus, ".key")

      return this.$store.dispatch('transactions/createTransaction', {cashier: cashier, tableNumber: tableNumber, items: items})
      .then(() => {
        //this.newTransaction.cashier = ''
        this.newTransaction.tableNumber = ''
        this.newTransaction.items = ''
        this.refreshMenuState()
        this.$root.$emit('bv::hide::modal', this.addTransactionModal.id)
      })
    },
    cancelTransaction(){
      this.newTransaction.tableNumber = ''
      this.newTransaction.items = ''
      this.filterMenu = ''
      this.refreshMenuState()
      this.$root.$emit('bv::hide::modal', this.addTransactionModal.id)
    },
    deleteTransaction(){
      return this.$store.dispatch('transactions/deleteTransaction', this.deleteTransactionModal.content.id) 
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.deleteTransactionModal.id)
      })
    },
    // modals    
    setAddModal(button){
      if(this.menus.length == 0){
        this.$root.$emit('bv::show::modal', "modal-no-menu", button)
      }else{
        this.$root.$emit('bv::show::modal', this.addTransactionModal.id, button)
      }
    },
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
    },
    refreshMenuState(){
      this.$store.dispatch('menus/setMenuQtyZero')
    },
    navigateToPageMenu(){
      this.$router.push({ name: "Menu" })
    }
  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus').then(() => {
      this.refreshMenuState()
    })
    this.$store.dispatch('transactions/fetchTodayTransactions').then(() => {
      this.isBusy = false
    })
  }
}
</script>

<style>

</style>