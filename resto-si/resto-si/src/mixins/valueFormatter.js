import moment from 'moment'
import 'moment/locale/id'  // without this line it didn't work
moment.locale('id')

export default {  
  methods: {
    toCurrencyFormat(number){
      return new Intl.NumberFormat('ba-ID', { style: 'currency', currency: 'IDR' })
      .format(number)
      .replace("IDR", "Rp")
      .replace(",", "?").replace(".", ",").replace("?", ".")
    },
    toHumaneDate(number){
      return moment.unix(number).format('D-MM-YYYY (H:MM:SS)')
    },
    toHumaneDateIdn(number){
      return moment.unix(number).format('D MMMM YYYY H:MM:SS')
    },
    toHumaneDateHMS(number){
      return moment.unix(number).format('H:MM:SS')
    }
  }
}