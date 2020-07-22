<template>
  <div class="col">
    <h4>Pengaturan Menu</h4>
    <br>
    <b-card  
      header-tag="header"
      class="box-shadow"
      style="border: 0"
      body-class="pt-0 mt-0">
      <template v-slot:header>
        <b-row>
          <b-col lg="6" class="my-1">
            <!-- Add Menu -->
            <div>
              <b-button
              variant="info"
              class="button-primary"
              @click="setEditModal(null, null, $event.target)"><font-awesome-icon :icon="icoPlus"/> Tambah Menu </b-button>
            </div>
          </b-col>
          <!-- Search bar -->
          <b-col lg="6" class="my-1">  
            <b-form-group
              v-show="menus.length > 0"
              label='Cari Menu'
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
                  placeholder="Ketik nama menu..."
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </template>

      <div class="text-center p-4" v-show="menus.length === 0">
        <img src="@/assets/nomenu.svg" style="max-height: 300px"><h3>Belum ada menu:(</h3>
      </div>


      <!-- Table -->
        <b-table
          v-show="menus.length > 0"
          show-empty
          small
          bordered
          hover
          head-variant="light"
          sticky-header="400px"
          :items="menus"
          :fields="fields"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :busy="isBusy"
        >
          <template v-slot:cell(actions)="row">
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
          <template v-slot:empty><div class="text-center col p-3">Tambahkan menu dengan menekan tombol Tambah Menu</div></template>
          <template v-slot:emptyfiltered><div class="text-center col p-3">Menu yang dicari tidak ditemukan</div></template>
        </b-table>
     
      <!-- Edit Menu Modal -->
      <b-modal :id="editMenuModal.id" :title="editMenuModal.title" centered button-size="sm"
        headerClass= 'p-2 border-bottom-0'
        body-class="px-4 pb-0"
        footerClass= 'pl-2 pb-2 border-top-0'
        >
        <!-- nama menu -->
        <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Nama Menu" label-for="input-sm" label-class="f-semibold">
          <b-form-input size="sm" v-model="editMenuModal.content.name"></b-form-input>
          <template v-if="$v.editMenuModal.content.name.$error">
            <div v-if="!$v.editMenuModal.content.name.required" class="form-error">*Nama menu wajib diisi</div>
          </template>
        </b-form-group>
        <!-- harga -->
        <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Harga" label-for="input-sm" label-class="f-semibold">
          <b-form-input size="sm" v-model="editMenuModal.content.price"></b-form-input>
          <template v-if="$v.editMenuModal.content.price.$error">
            <div v-if="!$v.editMenuModal.content.price.required" class="form-error">*Harga wajib diisi</div>
            <div v-if="!$v.editMenuModal.content.price.minLength" class="form-error">*Masukan nominal antara 500 sampai 1.000.000</div>
          </template>
        </b-form-group>
        <!-- jenis -->
        <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Jenis" label-for="input-sm" label-class="f-semibold">
          <b-form-select v-model="editMenuModal.content.type" :options="typeOptions">
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Pilih jenis menu --</b-form-select-option>
            </template>
          </b-form-select>
          <template v-if="$v.editMenuModal.content.type.$error">
            <div v-if="!$v.editMenuModal.content.type.required" class="form-error">*Tipe menu wajib dipilih</div>
          </template>
        </b-form-group>
        <template v-slot:modal-header>
          <div class="col pt-2 pl-2"><h5 class="pb-0 mb-0">{{editMenuModal.title}}</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="refreshAndCloseEditMenu()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer>
          <b-button size="sm" variant="outline-secondary" @click="refreshAndCloseEditMenu()">Batal</b-button>
          <b-button v-show="!editFlag" size="sm"  variant="info" class="button-primary" @click="createMenu()">Tambah Menu</b-button>
          <b-button v-show="editFlag" size="sm" variant="info" class="button-primary" @click="updateMenu()">Simpan</b-button>
        </template>
      </b-modal>

      <!-- Delete Menu Modal -->
      <b-modal 
        :id="deleteMenuModal.id"  
        centered button-size="sm"
        size="md"
        okVariant= 'danger'
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        {{ deleteMenuModal.content.text }}
        <template v-slot:modal-header="{ close }">
          <div class="col pt-2 pl-2"><h5 h5 class="pb-0 mb-0">{{deleteMenuModal.title}}</h5></div>
          <button type="button" class="close" data-dismiss="modal" @click="close()"><span aria-hidden="true" class="modal_button">&times;</span><span class="sr-only">Close</span></button>
        </template>
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" variant="outline-secondary" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="danger" @click="deleteMenu()">Hapus</b-button>
        </template>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import { faTrash, faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
import { required, between } from 'vuelidate/lib/validators'
import valueFormatter from '@/mixins/valueFormatter'

export default {
  name: 'Menu',
  mixins: [valueFormatter],
  data(){
    return {
      editFlag: true,
      typeOptions:  [
          { value: 'food', text: 'Makanan' },
          { value: 'drink', text: 'Minuman' }
      ],
      fields: [
        { key: 'name', label: 'Nama Menu', class: 'text-center', sortable: true, sortDirection: 'desc' },
        { 
          key: 'type', 
          label: 'Tipe', 
          class: 'text-center', 
          sortable: true , 
          formatter: (value) => {
              return value == 'food' ? 'Makanan' : 'Minuman'
            },
        },
        { key: 'price', label: 'Harga', class: 'text-center', sortable: true, formatter: this.toCurrencyFormat},
        { key: 'actions', label: '', class: 'text-center' }
      ],
      // filter
      filter: null,
      filterOn: ["name"],
      // sort
      sortBy: '',
      sortDesc: false,
      // busy indicator
      isBusy: true,
      // modal
      editMenuModal: {
        id: 'edit-menu-modal',
        title: '',
        content: {
          key: null,
          name: null,
          price: null,
          type: null
        }
      },
      addMenuModal: { 
        id: 'add-menu-modal' 
      },
      deleteMenuModal: { 
        id: 'delete-menu-modal',
        title: '',
        content: {
          id: null,
          text: ''
        }
      }
    }
  },
  validations: {
    editMenuModal: {
      content: {
        name: { required },
        price: { required, between: between(500, 1000000)},
        type: { required }
      }
    }
  },
  computed: {
    menus(){
      return Object.values(this.$store.state.menus.items)
    },
    sortOptions(){
      // Create an options list from our fields
      return this.fields
        .filter(field => field.sortable)
        .map(field => {
          return { text: field.label, value: field.key }
        })
    },
    // icon loader
    icoTrash(){
      return faTrash
    },
    icoEdit(){
      return faPen
    },
    icoPlus(){
      return faPlus
    }
    
  },
  methods: {
    createMenu(){
      this.$v.editMenuModal.$touch()
      if (this.$v.editMenuModal.content.$invalid) {
        return // break the register method if form is invalid
      }
      const name = this.editMenuModal.content.name
      const price = this.editMenuModal.content.price
      const type = this.editMenuModal.content.type

      return this.$store.dispatch('menus/createMenu', {name: name, price: price, type: type}) // return a promise (check store)
      .then(() => {
        this.refreshAndCloseEditMenu()
      })
    },
    updateMenu(){
      if (this.$v.editMenuModal.content.$invalid) {
        return // break the register method if form is invalid
      }
      const payload = {
        id: this.editMenuModal.content.key, 
        newName: this.editMenuModal.content.name, 
        newPrice: this.editMenuModal.content.price, 
        newType: this.editMenuModal.content.type
      }
      return this.$store.dispatch('menus/updateMenu', payload) 
      .then(() => {
        this.refreshAndCloseEditMenu()
      })
    },
    refreshAndCloseEditMenu(){
      this.$nextTick(() => { this.$v.$reset() })
      this.editMenuModal.content.name = ''
      this.editMenuModal.content.price = ''
      this.editMenuModal.content.type = null
      this.$root.$emit('bv::hide::modal', this.editMenuModal.id)
    },
    deleteMenu(){
      return this.$store.dispatch('menus/deleteMenu', this.deleteMenuModal.content.id) 
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.deleteMenuModal.id)
      })
    },
    // modals methods
    setEditModal(item, index, button) {
      if(index !== null && item !== null){
        this.editFlag = true
        this.editMenuModal.title = `Ubah menu: ${item.name}`
        this.editMenuModal.content.key = item['.key']
        this.editMenuModal.content.name = item.name
        this.editMenuModal.content.type = item.type
        this.editMenuModal.content.price = item.price
      }else{
        this.editFlag = false
        this.editMenuModal.title = `Tambah menu baru`
      }
      this.$root.$emit('bv::show::modal', this.editMenuModal.id, button)
    },
    setAddModal(button){
      this.$root.$emit('bv::show::modal', this.addMenuModal.id, button)
    },
    setDeleteModal(item, index, button){
      this.deleteMenuModal.title = `Hapus menu ${item.name}?`
      this.deleteMenuModal.content.text = `Apakah anda yakin ingin menghapus ${item.name}?`
      this.deleteMenuModal.content.id = item['.key']
      this.$root.$emit('bv::show::modal', this.deleteMenuModal.id, button)
    }
  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus')
    .then(() => {
      this.isBusy = !this.isBusy
    })
  }
}
</script>

<style scoped>

</style>