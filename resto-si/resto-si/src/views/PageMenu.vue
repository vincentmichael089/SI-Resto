<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Pengaturan Menu</h4>
    </div>
    <!-- Add Menu -->
    <div class="col">
      <b-button 
      size="sm" 
      variant="success"
      @click="setAddModal($event.target)"><font-awesome-icon :icon="icoPlus"/> Tambah Menu </b-button>
      </div>
    <b-card  
      header-tag="header"  
      style="margin: 1rem;"
      class="mb-2">
      <template v-slot:header>
        <b-row>
          <!-- Search bar -->
          <b-col lg="6" class="my-1">  
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
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  placeholder="Ketik nama menu..."
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-col>
          <!-- Sorting -->
          <b-col lg="6" class="my-1">
            <b-form-group
              label='Urutkan'
              label-cols-lg="3"
              label-align-lg="right"
              label-size="sm"
              label-for="sortBySelect"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
                  <template v-slot:first>
                    <option value="">-- urutkan --</option>
                  </template>
                </b-form-select>
                <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </template>

      <!-- Table -->
        <b-table
          show-empty
          fixed
          small
          striped
          bordered
          hover
          stacked="md"
          :items="menus"
          :fields="fields"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
        <template v-slot:cell(actions)="row">
          <b-button variant="info" size="sm" 
            @click="setEditModal(row.item, row.index, $event.target)" class="mr-1">
            <font-awesome-icon :icon="icoEdit"/>
          </b-button>
          <b-button variant="danger" size="sm" 
            @click="setDeleteModal(row.item, row.index, $event.target)">
            <font-awesome-icon :icon="icoTrash"/>
          </b-button>
        </template>
      </b-table>

      <!-- Edit Menu Modal -->
      <b-modal :id="editMenuModal.id" :title="editMenuModal.title" centered button-size="sm"
        headerClass= 'p-2'
        footerClass= 'p-2'>
          <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Nama Menu" label-for="input-sm">
            <b-form-input size="sm" v-model="editMenuModal.content.name"></b-form-input>
          </b-form-group>
          <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Harga" label-for="input-sm">
            <b-form-input size="sm" v-model="editMenuModal.content.price"></b-form-input>
          </b-form-group>
          <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Jenis" label-for="input-sm">
            <b-form-select v-model="editMenuModal.content.type" :options="typeOptions"></b-form-select>
          </b-form-group>
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" variant="danger" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="success" @click="updateMenu()">Simpan</b-button>
        </template>
      </b-modal>

       <!-- Add Menu Modal -->
      <b-modal 
        :id="addMenuModal.id" title="Tambah Menu Baru" 
        centered button-size="md"
        headerClass= 'p-2'
        footerClass= 'p-2'>
        <div>
          <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Nama Menu" label-for="input-sm">
            <b-form-input size="sm" v-model="newMenu.name"></b-form-input>
          </b-form-group>
          <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Harga" label-for="input-sm">
            <b-form-input size="sm" v-model="newMenu.price"></b-form-input>
          </b-form-group>
          <b-form-group label-cols="3" label-cols-lg="3" label-size="sm" label="Jenis" label-for="input-sm">
            <b-form-select v-model="newMenu.type" :options="typeOptions">
              <template v-slot:first>
                <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </div>
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" variant="danger" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="success" @click="createMenu()">Tambah Menu</b-button>
        </template>
      </b-modal>

      <!-- Delete Menu Modal -->
      <b-modal 
        :id="deleteMenuModal.id" 
        :title="deleteMenuModal.title" 
        centered button-size="sm"
        size="md"
        okVariant= 'danger'
        headerClass= 'p-2 border-bottom-0'
        footerClass= 'p-2 border-top-0'>
        {{ deleteMenuModal.content }}
        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button size="sm" @click="cancel()">Batal</b-button>
          <b-button size="sm" variant="danger" @click="ok()">Hapus</b-button>
        </template>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
import { faTrash, faPen, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Menu',
  data(){
    return {
      newMenu: {
        name: null,
        price: null,
        type: null
      },
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
        { key: 'price', label: 'Harga', class: 'text-center', sortable: true },
        { key: 'actions', label: '', class: 'text-center' }
      ],
      // filter
      filter: null,
      filterOn: ["name"],
      // sort
      sortBy: '',
      sortDesc: false,
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
        content: ''
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
    icoTrash(){
      return faTrash
    },
    icoEdit(){
      return faPen
    },
    icoPlus(){
      return faPlusSquare
    }
    
  },
  methods: {
    createMenu(){
      const name = this.newMenu.name
      const price = this.newMenu.price
      const type = this.newMenu.type
      this.newMenu.name = ''
      this.newMenu.price = ''
      this.newMenu.type = ''
      return this.$store.dispatch('menus/createMenu', {name: name, price: price, type: type}) // return a promise (check store)
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.addMenuModal.id)
      })
    },
    updateMenu(){
      const payload = {
        id: this.editMenuModal.content.key, 
        newName: this.editMenuModal.content.name, 
        newPrice: this.editMenuModal.content.price, 
        newType: this.editMenuModal.content.type
      }
      return this.$store.dispatch('menus/updateMenu', payload) 
      .then(() => {
        this.$root.$emit('bv::hide::modal', this.editMenuModal.id)
      })
    },

    // modals methods
    setEditModal(item, index, button) {
      this.editMenuModal.title = `Ubah menu: ${item.name}`
      this.editMenuModal.content.key = item['.key']
      this.editMenuModal.content.name = item.name
      this.editMenuModal.content.type = item.type
      this.editMenuModal.content.price = item.price
      this.$root.$emit('bv::show::modal', this.editMenuModal.id, button)
    },
    setAddModal(button){
      this.$root.$emit('bv::show::modal', this.addMenuModal.id, button)
    },
    setDeleteModal(item, index, button){
      this.deleteMenuModal.title = `Hapus menu ${item.name}?`
      this.deleteMenuModal.content = `Apakah anda yakin ingin menghapus ${item.name}?`
      this.$root.$emit('bv::show::modal', this.deleteMenuModal.id, button)
    }
  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus')
  }
}
</script>

<style scoped>

</style>