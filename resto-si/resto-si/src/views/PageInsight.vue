<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Insight</h4>
    </div>
    <b-card  
    header-tag="header"  
    style="margin: 1rem;"
    class="mb-2 ">
      <template v-slot:header>
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
        </b-row>
      </template>
      <AppChartLine :data="transactionsIncomeByTime" />
    </b-card>
    
  </div>
</template>

<script>
import AppChartLine from '@/components/AppChartLine.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'Insight',
  components: {
    AppChartLine
  },
  data(){
    return {
      isBusy: true,
      timeFlag: 1,
      timeOptions: [
        { value: null, text: '-- Pilih rentang waktu--', disabled: true },
        { value: 1, text: '1 Minggu terakhir' },
        { value: 2, text: '1 Bulan terakhir' },
        { value: 3, text: '3 Bulan terakhir' },
        { value: 4, text: '6 Bulan terakhir' },
        { value: 5, text: '1 Tahun terakhir' }
      ],
    }
  },
  computed: {
    ...mapGetters({
      transactionsIncomeByTime: 'transactions/transactionsIncomeTimed'
    }),
  },
  methods: {
    getTransactionsInTimeSpan(){
      this.isBusy = true
      this.$store.dispatch('transactions/fetchTimedTransactions', {flag: this.timeFlag}).then(() => {
        this.isBusy = false
      })
    }
  },
  beforeCreate(){
    this.$store.dispatch('transactions/fetchTimedTransactions', {flag: 1}).then(() => {
      this.isBusy = false
    })
  }
}
</script>

<style>

</style>