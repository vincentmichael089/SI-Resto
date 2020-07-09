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
      </template>
      <div class="container">
        <InsightHeader/>
        <div class="row pt-4">
          <div class="col-md-6">
            <strong>Pendapatan {{chartTitle}}</strong>
            <AppChartLine :data="chartData" />
          </div>
          <div class="col-md-6">
            <strong>Pengunjung {{chartTitle}}</strong>
            <AppChartBar :data="chartData" />
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import AppChartLine from '@/components/AppChartLine.vue'
import AppChartBar from '@/components/AppChartBar.vue'
import InsightHeader from '@/components/InsightHeader.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'Insight',
  components: {
    InsightHeader,
    AppChartLine,
    AppChartBar
  },
  data(){
    return {
      isBusy: true,
      timeFlag: 1,
      timeOptions: [
        { value: null, text: '-- Pilih rentang waktu--', disabled: true },
        { value: 0, text: 'Hari Ini' }, //for chart debug
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
    chartData(){
      const dup = [...Object.values({...this.transactionsIncomeByTime})].reduce((res, obj) => {
        res[obj.date] = { 
          income: (obj.date in res ? res[obj.date].income : 0) + obj.income,
          visitor: (obj.date in res ? res[obj.date].visitor : 0) + 1,
          timestamp: obj.date
        }
        return res;
      }, {})

      return [...Object.values(dup)]
    },
    chartTitle(){
      let title

      switch(this.timeFlag){
        case 0: 
          title = 'Hari Ini'
          break;
        case 1:
          title = '1 Minggu Terakhir'
          break;
        case 2: 
          title = '1 Bulan Terakhir'
          break;
        case 3:
          title = '3 Bulan Terakhir'
          break;
        case 4: 
          title = '6 Bulan Terakhir'
          break;      
        case 5: 
          title = '1 Tahun Terakhir'
          break;                                  
      }

      return title
    }
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