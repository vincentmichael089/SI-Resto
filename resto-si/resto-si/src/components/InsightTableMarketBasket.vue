<template>
  <div>
    <div class="container"><div class="px-4 note note-info">
      <div class="f-semibold">3 metrik penting dalam Market Basket Analysis</div>
      <div>
        1. Support: Persentase kemunculan suatu menu terhadap jumlah keseluruhan transaksi<br>
        2. Confidence: Persentase pembelian item Y ketika item X dibeli (X 🡆 Y)<br>
        3. Lift: Nilai hubungan antara menu X dan Y<br>
      </div>
      <small>Lift sama dengan 1 berarti tidak ada hubungan antara menu X dan Y, 
        Lift dibawah 1 berarti terdapat hubungan negatif antara menu X dan Y,
        Lift diatas 1 berarti terdapat hubungan positif antara menu X dan Y</small>
    </div></div>
    <div class="row col">
      <div class="col-lg-4 col-md-6">
        <label for="range-2" class="f-semibold">Support Minimal {{ minSupp }}</label>
        <b-form-input id="range-2" v-model="minSupp" type="range" min="0" max="0.99" step="0.025" class="pt-lg-3"></b-form-input>
      </div>
      <div class="col-lg-4 col-md-6">
        <label for="range-2" class="f-semibold">Confidence Minimal {{ minConf }}</label>
        <b-form-input id="range-2" v-model="minConf" type="range" min="0" max="0.99" step="0.025" class="pt-lg-3"></b-form-input>
      </div>
      <div class="col-lg-4 col-md-12">
        <label for="range-2" class="f-semibold">Filter Pasangan / Triplet</label>
        <b-form-input v-model="filter" placeholder="Ketik nama menu..." size="sm"></b-form-input>
      </div>
    </div>
    <b-table
      style="margin: 1rem;"
      class="mb-2 "
      show-empty
      small
      bordered
      hover
      head-variant="light"
      sticky-header="400px"
      :items="rules"
      :fields="fields"
      :filter="filter"
      :filterIncludedFields="filterOn"
    >
      <template v-slot:table-busy>
        <div class="text-center text-secondary my-2 p-3">
          <div class="col"><b-spinner variant="secondary" class="align-middle"></b-spinner></div>
          <div class="col"><strong>Memuat...</strong></div>
      </div>
      </template>
      <template v-slot:empty><div class="text-center col p-3">Pasangan menu tidak ditemukan</div></template>
      <template v-slot:emptyfiltered><div class="text-center col p-3">Pasangan menu tidak ditemukan</div></template>
    </b-table>
  </div>
</template>

<script>
import * as mba from '@/mba.js'

export default {
  name: 'TableMarketBasket',
  props: {
    transactionsByTime: {
      type: Array,
      required: true
    }
  },
  data(){
    return{
      minSupp: 0,
      minConf: 0,
      fields: [
        { key: 'name', label: 'Pasangan / Triplet', class: 'text-center', sortable: true},
        { key: 'confidence', label: 'Confidence', class: 'text-center', sortable: true},
        { key: 'lift', label: 'Lift', class: 'text-center', sortable: true }
      ],
      // filter
      filter: "",
      filterOn: ["name"],
    }
  },
  computed:{
    rules(){
      return Object.values(mba.apriori(this.transactionsByTime, this.minSupp)).filter(rule => rule.confidence > this.minConf)
    },
  }
}
</script>

<style>

</style>