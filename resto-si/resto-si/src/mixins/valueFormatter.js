import moment from 'moment'

export default {  
  methods: {
    toCurrencyFormat(number){
      return new Intl.NumberFormat('ba-ID', { style: 'currency', currency: 'IDR' })
      .format(number)
      .replace("IDR", "Rp")
      .replace(",", "?").replace(".", ",").replace("?", ".")
    },
    
    toHumaneDate(number){
      return moment.unix(number).format('DD-MM-YYYY (h:m:s a)')
    }
  }
}