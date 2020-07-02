<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Pengaturan Menu</h4>
    </div>
    <!-- Add Menu -->
    <div class="col"><b-button size="sm" variant="success">+ Tambah Menu </b-button></div>
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
          <b-button variant="info" size="sm" @click="setEditModal(row.item, row.index, $event.target)" class="mr-1">
            Ubah
          </b-button>
          <b-button variant="danger" size="sm" >
            Hapus
          </b-button>
        </template>
      </b-table>

      <!-- Edit menu modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only>
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data(){
    return {
      newMenu: {
        name: null,
        price: null
      },
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
      filter: null,
      filterOn: ["name"],
      sortBy: '',
      sortDesc: false,
      infoModal: {
        id: 'info-modal',
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
    }
  },
  methods: {
    createMenu(){
      const name = this.newMenu.name
      const price = this.newMenu.price
      this.newMenu.name = ''
      this.newMenu.price = ''
      return this.$store.dispatch('menus/createMenu', {name: name,price: price}) // return a promise (check store)
    },
    setEditModal(item, index, button) {
      this.infoModal.title = `Ubah Menu: ${item.name}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus')
  }
}
</script>

<style scoped>

</style>