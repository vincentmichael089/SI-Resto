<template>
  <div>
    <b-card  
      header-tag="header"  
      style="margin: 1rem; border: 0"
      body-class="pt-0 mt-0"
      class="mb-2">
      <template v-slot:header>
        <b-row v-show="transactions.length > 0">
          <b-col lg="6" class="my-1"><strong>Total Pemasukan Hari Ini: {{toCurrencyFormat(dailyIncome)}}</strong></b-col>
          <!-- Search bar -->
          <b-col lg="6" class="my-1">  
            <b-form-group
              label='Cari Transaksi'
              label-cols-lg="3"
              label-align-lg="right"
              label-for="filterInput"
              class="mb-0"
              label-class="f-semibold"
            >
              <b-input-group>
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

      <div class="text-center text-secondary my-2 p-3" v-show="isBusy">
        <div class="col"><b-spinner variant="secondary" class="align-middle"></b-spinner></div>
        <div class="col p-2"><strong>Memuat...</strong></div>
      </div>
      <div class="text-center" v-show="transactions.length === 0 && !isBusy">
        <img src="@/assets/notransaction.svg" style="max-height: 300px"><h3>Belum ada transaksi hari ini</h3>
      </div>

      <!-- Table -->
      <b-table
        v-show="transactions.length > 0 "
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
            <div class="col p-2"><strong>Memuat...</strong></div>
          </div>
        </template>
        <template v-slot:empty><div class="text-center col p-3">Belum ada transaksi hari ini</div></template>
        <template v-slot:emptyfiltered><div class="text-center col p-3">ID Transaksi tidak ditemukan</div></template>
      </b-table>
    </b-card>
    
      <!-- Delete Transaction Modal -->
      <b-modal 
        :id="deleteTransactionModal.id" 
        centered button-size="sm"
        size="sm"
        okVariant= 'danger'
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        {{ deleteTransactionModal.content.text }}
        <template v-slot:modal-header="{ close }">
          <div class="col pt-2 pl-2"><h5 h5 class="pb-0 mb-0">{{deleteTransactionModal.title}}</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="close()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" variant="outline-secondary" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="danger" @click="deleteTransaction()">Hapus</b-button>
        </template>
      </b-modal>

      <!-- Finish Transaction Modal -->
      <b-modal 
        id="finish-transaction-modal" 
        centered button-size="sm"
        size="sm"
        okVariant= 'danger'
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        <div>Selesaikan transaksi?</div>
        <template v-slot:modal-header="{ close }">
          <div class="col pt-2 pl-2"><h5 h5 class="pb-0 mb-0">Konfirmasi</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="close()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="success" @click="finishTransaction()">Selesai</b-button>
        </template>
      </b-modal>

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
          <b-button size="sm" @click="ok()" variant="info" class="button-primary">Tutup</b-button>
          <b-button v-show="finishFlag" size="sm" @click="setFinishModal()" variant="success">Selesai</b-button>
        </template>
      </b-modal>

      <!-- Edit Transaction Modal -->
      <b-modal 
        :id="editTransactionModal.id" 
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
              label-class="f-semibold"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="editTransactionModal.content.tableNumber"
                  placeholder="nomor meja..."
                ></b-form-input>
                <template v-if="$v.editTransactionModal.content.tableNumber.$error">
                  <div v-if="!$v.editTransactionModal.content.tableNumber.required" class="form-error">*Nomor meja wajib diisi</div>
                </template>
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
              label-class="f-semibold"
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
            :items="dynamicMenu"
            :fields="menusFields"
            :filter="filterMenu"
            :filterIncludedFields="filterMenuOn"
            :sort-by.sync="sortMenuBy"
            :sort-desc.sync="sortDesc"
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
                <strong class="p-2">Memuat...</strong>
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
        <template v-slot:modal-header>
          <div class="col pt-2 pl-2"><h5 class="pb-0 mb-0">{{editTransactionModal.title}}</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="cancelTransaction()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer>
          <b-button size="sm" variant="outline-secondary" @click="cancelTransaction()">Batal</b-button>
          <b-button size="sm" variant="outline-info" v-b-modal.modal-add-transaction-detail>Rincian</b-button>
          <b-button v-show="editFlag" size="sm" variant="info" class="button-primary" @click="updateTransaction()">Simpan</b-button>
          <b-button v-show="!editFlag" size="sm" variant="info" class="button-primary" @click="createTransaction()">Tambah</b-button>
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
          <div class="text-center col  p-3"><img src="@/assets/nomenu.svg" style="max-height: 300px">Tidak ada menu! Tambahkan menu <span @click="navigateToPageMenu()" style="color: green; cursor: pointer;">disini</span></div>
          <template v-slot:modal-footer="{ cancel }">
            <b-button size="sm" variant="outline-secondary" @click="cancel()">Tutup</b-button>
          </template>
      </b-modal>
        
      <!-- Add Transaction Detail Modal -->
      <b-modal id="modal-add-transaction-detail" 
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
                <td>{{editTransactionModal.content.cashier}}</td>
              </tr>
              <tr>
                <td class="mr-4">Nomor Meja</td>
                <td></td>
                <td>{{editTransactionModal.content.tableNumber}}</td>
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
        <template v-slot:modal-header="{ close }">
          <div class="col pt-2 pl-2"><h5 class="pb-0 mb-0">Rincian Transaksi</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="close()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="info" class="button-primary" @click="ok()">Tutup</b-button>
        </template>
      </b-modal>
  </div>
</template>

<script>
import { faPlusSquare, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import valueFormatter from '@/mixins/valueFormatter'
import {mapGetters} from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CashierTransactionHistory',
  mixins: [valueFormatter],
  data(){
    return{
      dynamicMenu: [],
      editFlag: true,
      finishFlag: false,
      transactionIdHolder: null,
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true },
        { key: 'timestamp', label: 'Waktu Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc'},
        { key: 'income', label: 'Pemasukan', class: 'text-center', sortable: true },
        { key: 'active', label: 'Status Transaksi', class:'text-center', sortable: true, formatter: (value) => {
          return value ? 'Belum Selesai' : 'Selesai'
        } },
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
      sortMenuBy: 'type',
      // modals
      deleteTransactionModal: { 
        id: 'delete-transaction-modal',
        title: '',
        content: {
          id: null,
          text: ''
        }
      },
      editTransactionModal: { 
        id: 'edit-transaction-modal',
        title: '',
        content : {
          key: null,
          cashier: 'mock',
          transactionItems: {},
          tableNumber: null,
        }
      },
      infoTransactionModal: {
        id: 'info-transaction-modal',
        title: '',
        content: {}
      }
    }
  },
  validations: {
    editTransactionModal: {
      content : {
        //transactionItems: {},
        tableNumber: { required },
      }
    },
  },
  computed: {
    ...mapGetters({
      dailyIncome: 'transactions/transactionsIncomeTotal'
    }),
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
          transactionId: transaction.cashier.toUpperCase().substring(0, 4).concat(`-${transaction.tableNumber}-`.concat(transaction.timestamp)),
          cashier: transaction.cashier,
          tableNumber: transaction.tableNumber,
          timestamp: transaction.timestamp,
          lastEditAt:transaction.lastEditAt,
          transactionItems: transaction.items,
          active: transaction.active,
          income: this.toCurrencyFormat(sum),
        }
      })
    },
    activeTransactions(){
      return this.transactions.filter(transaction => transaction.active === true).sort((a, b) => (a.timestamp > b.timestamp) ? -1 : 1)
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
      const cashier = this.editTransactionModal.content.cashier
      const tableNumber = this.editTransactionModal.content.tableNumber
      
      const arrayToObject = (array, keyField) =>
        array.reduce((obj, item) => {
          obj[item[keyField]] = item
          delete obj[item[keyField]]['.key']
          return obj
        }, {})

      const items = arrayToObject(this.selectedMenus, ".key")

      return this.$store.dispatch('transactions/createTransaction', {cashier: cashier, tableNumber: tableNumber, items: items})
      .then(() => {
        //this.editTransaction.cashier = ''
        this.editTransactionModal.content.tableNumber = ''
        this.editTransactionModal.content.items = ''
        this.refreshMenuState()
        this.$root.$emit('bv::hide::modal', this.editTransactionModal.id)
      })
    },
    cancelTransaction(){
      this.$nextTick(() => { this.$v.$reset() })
      this.editTransactionModal.content.tableNumber = ''
      this.editTransactionModal.content.items = ''
      this.filterMenu = ''
      this.refreshMenuState()
      this.$root.$emit('bv::hide::modal', this.editTransactionModal.id)
    },
    deleteTransaction(){
      return this.$store.dispatch('transactions/deleteTransaction', this.deleteTransactionModal.content.id) 
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.deleteTransactionModal.id)
      })
    },
    updateTransaction(){
      this.$v.editTransactionModal.$touch()
      if (this.$v.editTransactionModal.content.$invalid) {
        return // break the register method if form is invalid
      }
      
      const arrayToObject = (array, keyField) =>
        array.reduce((obj, item) => {
          obj[item[keyField]] = item
          delete obj[item[keyField]]['.key']
          return obj
        }, {})

      const items = arrayToObject(this.selectedMenus, ".key")

      const payload = {
        id: this.editTransactionModal.content.key,
        newTableNumber: this.editTransactionModal.content.tableNumber,
        newItems: items
      }

      return this.$store.dispatch('transactions/updateTransaction', payload) 
        .then(() => {
          this.refreshMenuState()
          this.$root.$emit('bv::hide::modal', this.editTransactionModal.id)
        })
    },
    finishTransaction(){
      return this.$store.dispatch('transactions/finishTransaction', {id: this.transactionIdHolder})
      .then(() => {
        this.$root.$emit('bv::hide::modal', "finish-transaction-modal")
        this.$root.$emit('bv::hide::modal', this.infoTransactionModal.id)
      })
    },
    // modals    
    setEditModal(item, index, button){
      /////////////
      this.dynamicMenu = [...this.menus]
      Object.values(item.transactionItems).forEach(it => {
        let i = this.dynamicMenu.findIndex(itemMenu => itemMenu.name === it.name)
        this.dynamicMenu[i] = it
      })
      ////////////
      if(item !== null && index !== null){
        this.editFlag = true
        this.editTransactionModal.title = `Ubah Transaksi ${item.transactionId}`
        this.editTransactionModal.content.key = item.key
        this.editTransactionModal.content.cashier = item.cashier
        this.editTransactionModal.content.tableNumber = item.tableNumber

        this.$store.dispatch('menus/fetchAllMenusModifiedByTransactionId', {id:item.key})
        this.$root.$emit('bv::show::modal', this.editTransactionModal.id, button)
      }else{
        this.editFlag = false
        if(this.menus.length == 0){
          this.$root.$emit('bv::show::modal', "modal-no-menu", button)
        }else{
          this.editTransactionModal.title = `Tambah Transaksi Baru`
          this.$nextTick(() => { this.$root.$emit('bv::show::modal', this.editTransactionModal.id, button) })
        }
      }
    },
    setInfoModal(item, index, button){
      this.finishFlag = isNaN(index) ? true : false
      this.transactionIdHolder = index,
      this.infoTransactionModal.title = `Rincian Transaksi ${item.transactionId}`
      this.infoTransactionModal.content = item
      this.$root.$emit('bv::show::modal', this.infoTransactionModal.id, button)
    },
    setDeleteModal(item, index, button){
      this.deleteTransactionModal.title = `Konfirmasi`
      this.deleteTransactionModal.content.text = `Apakah anda yakin ingin menghapus transaksi ${item.transactionId} ?`
      this.deleteTransactionModal.content.id = item.key
      this.$root.$emit('bv::show::modal', this.deleteTransactionModal.id, button)
    },
    setFinishModal(button){
      this.$root.$emit('bv::show::modal', "finish-transaction-modal", button)
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
    this.$store.dispatch('transactions/fetchTimedTransactions', {flag: 0}).then(() => {
      this.isBusy = false
    })
  }
}
</script>

<style>

</style>