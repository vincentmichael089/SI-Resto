<template>
  <div>
    <div style="margin: 1rem;" class="pb-2">
      <h4>Riwayat Transaksi</h4>
    </div>
    <b-card  
      header-tag="header"  
      body-class="pt-0 mt-0"
      style="margin: 1rem; border: 0"
      class="mb-2 box-shadow">
      <template v-slot:header>
        <b-col class="my-1 pl-0 mr-0 mb-3"><h5 class="f-semibold">{{timeOptionsText}} : {{toCurrencyFormat(income)}}</h5></b-col>
        <b-row>
          <b-col lg="6" class="my-1">
            <b-form-group
              label="Rentang waktu"
              label-cols-lg="3"
              label-align-lg="right"
              label-for="initialSortSelect"
              label-class="f-semibold"
              class="mb-0"
            >
              <b-form-select
                @change="getTransactionsInTimeSpan()"
                v-model="timeFlag"
                id="initialSortSelect"
                :options="timeOptions"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <!-- Search bar -->
          <b-col lg="6" class="my-1">  
            <b-form-group
              label='Cari Transaksi'
              label-cols-lg="3"
              label-align-lg="right"
              label-for="filterInput"
              label-class="f-semibold"
              class="mb-0"
            >
              <b-input-group>
                <b-form-input
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  placeholder="ID / tanggal transaksi..."
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
          <!-- <b-button variant="warning" size="sm" 
            @click="setEditModal(row.item, row.index, $event.target)" class="mr-1">
            <font-awesome-icon :icon="icoEdit"/>
          </b-button> -->
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
        <template v-slot:empty>
          <div class="text-center p-4">
            <img src="@/assets/notransactions.svg" style="max-height: 200px"><h3>Transaksi tidak ditemukan:(</h3>
          </div>
        </template>
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
          <b-button size="sm" @click="ok()" variant="info" class="button-primary">Tutup</b-button>
        </template>
      </b-modal>

       <!-- Delete Transaction Modal -->
      <b-modal 
        :id="deleteTransactionModal.id" 
        centered button-size="sm"
        size="md"
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
                class="mb-0"
                label-class="f-semibold"
              >
                <b-input-group size="sm">
                  <b-form-input
                    v-model="editTransactionModal.content.tableNumber"
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
                label-class="f-semibold"
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
          <b-button size="sm" variant="info" class="button-primary" @click="updateTransaction()">Simpan</b-button>
        </template>  
      </b-modal>

      <!--  Transaction Detail Modal -->
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
          <b-button size="sm" @click="ok()">Tutup</b-button>
        </template>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import { faPlusSquare, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import valueFormatter from '@/mixins/valueFormatter'
import {mapGetters} from 'vuex'

export default {
  name: 'Recap',
  mixins: [valueFormatter],
  data(){
    return{
      timeFlag: 1,
      fields: [
        { key: 'transactionId', label: 'ID Transaksi', class: 'text-center', sortable: true },
        { key: 'timestamp', label: 'Waktu Transaksi', class: 'text-center', sortable: true, sortDirection: 'desc', filterByFormatted: true,
          formatter: this.toHumaneDateIdn
        },
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
      timeOptions: [
        { value: null, text: '-- Pilih rentang waktu--', disabled: true },
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
      filterMenuOn: ["name"],
      // sort
      sortBy: 'timestamp',
      sortDesc: true,
      // modals
      infoTransactionModal: {
        id: 'info-transaction-modal',
        title: '',
        content: {}
      },
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
    }
  },
  computed: {
    ...mapGetters({
      income: 'transactions/transactionsIncomeTotal'
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
    timeOptionsText(){
      switch(this.timeFlag){
        case 0: // today
          return 'Total Pemasukan Hari Ini'
        case 1: // last 1 week 
          return 'Total Pemasukan 1 Minggu Terakhir'
        case 2: // last 1 month
          return 'Total Pemasukan 1 Bulan Terakhir'
        case 3: // last 3 month
          return 'Total Pemasukan 3 Bulan Terakhir'
        case 4: // last 6 month
          return 'Total Pemasukan 6 Bulan Terakhir'
        case 5: // last 1 year
          return 'Total Pemasukan 1 Tahun Terakhir'
        default:
          return ''
      }
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
    deleteTransaction(){
      return this.$store.dispatch('transactions/deleteTransaction', this.deleteTransactionModal.content.id) 
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.deleteTransactionModal.id)
      })
    },
    cancelTransaction(){
      this.editTransactionModal.content.tableNumber = ''
      this.editTransactionModal.content.items = ''
      this.filterMenu = ''
      this.refreshMenuState()
      this.$root.$emit('bv::hide::modal', this.editTransactionModal.id)
    },
    updateTransaction(){
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
    // modals    
    setEditModal(item, index, button){
      this.editTransactionModal.title = `Ubah Transaksi ${item.transactionId}`
      this.editTransactionModal.content.key = item.key
      this.editTransactionModal.content.cashier = item.cashier
      this.editTransactionModal.content.tableNumber = item.tableNumber
      this.$store.dispatch('menus/fetchAllMenusModifiedByTransactionId', {id:item.key})
      this.$root.$emit('bv::show::modal', this.editTransactionModal.id, button)
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