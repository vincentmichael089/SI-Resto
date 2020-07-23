<template>
  <div style="height: 80vh; padding-top: 5%">
    <div class="container">
      <div class="row" style="height: 70vh">
        <div class="col-md-5 d-none d-lg-block pl-3 pt-4" style="margin: auto;">
          <div class="f-bold" style="font-size: 4vh; line-height: 1.2">Kasir rumah makan, semakin mudah dan pintar.</div>
          <div class="f-regular pt-2" style="font-size: 2.4vh; line-height: 1">Kasir, Riwayat Transaksi, dan Insight dalam satu aplikasi.</div>
        </div>
        <div class="col-md-7 p-4" style="margin: auto;">
          <div style="background-color: white;" class="box-shadow p-4">
            <div class="p-4 text-center">
              <div class="f-bold" style="font-size: 4vh; line-height: 1.2">Masuk SIRESTO</div>
            </div>
            <div style="margin:auto" class="p-3">
              <div class="pb-3">
                <div class="f-semibold pb-1">Alamat Email</div>
                <b-form-input v-model="form.email" v-on:blur="$v.form.email.$touch()"></b-form-input>
                <template v-if="$v.form.email.$error">
                  <div v-if="!$v.form.email.required" class="form-error">*Alamat email wajib diisi</div>
                  <div v-else-if="!$v.form.email.email" class="form-error">*Format alamat email salah</div>
                </template>
              </div>
              <div class="pb-3"> 
                <div class="f-semibold pb-1">Password</div>
                <b-form-input v-model="form.password" type="password" v-on:blur="$v.form.password.$touch()"></b-form-input>
                <template v-if="$v.form.password.$error">
                  <div v-if="!$v.form.password.required" class="form-error">*Password wajib diisi</div>
                  <div v-else-if="!$v.form.password.minLength" class="form-error">*Password minimal 6 karakter</div>
                </template>
              </div>
              <b-button variant="info" class="button-primary f-semibold p-2 m-2 px-4" @click="login()" :disabled="isBusy" style="width: 100px">
                <div v-if="!isBusy">Masuk</div><b-spinner v-else variant="light" class="align-middle" small/>
              </b-button>
              <span class="pl-2">Belum punya akun?  <router-link :to="{ name: 'Register'}">Daftar</router-link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required, email, minLength} from 'vuelidate/lib/validators'

export default {
  data(){
    return{
      form: {
        email: null,
        password: null
      },
      isBusy: false
    }
  },
  validations: {
    form: {
      email: {
        required, email
      },
      password: {
        required, minLength: minLength(6)
      }
    }
  },
  methods: {
    login(){
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return // break the register method if form is invalid
      }else if (!this.$v.form.$invalid) {
        this.isBusy = true
        this.$store.dispatch('auth/signInWithEmailAndPassword', {
          email: this.form.email,
          password: this.form.password
        })
        .then(() => this.successRedirect())
        .catch(error => {
          alert(error.message)
          this.isBusy = false  
        })
      }
    },

    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || {name: 'Home'}
      this.$router.push(redirectTo)
      this.isBusy = false
    }
  }
}
</script>

<style>

</style>