import {helpers as vuelidateHelpers} from 'vuelidate/lib/validators'
import firebase from 'firebase'

export const uniqueMenu = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve) => {
    firebase.database().ref('menus').orderByChild('name').equalTo(value)
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

export const uniqueUsername = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve) => {
    firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

export const uniqueEmail = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve) => {
    firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}
