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
      return moment.unix(number).format('D-MM-YYYY (H:mm:ss)')
    },
    toHumaneDateIdn(number){
      return moment.unix(number).format('D MMMM YYYY H:mm:ss')
    },
    toHumaneDateHMS(number){
      return moment.unix(number).format('H:mm:ss')
    }
  }
}