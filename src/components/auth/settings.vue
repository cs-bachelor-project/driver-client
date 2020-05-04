<template>
  <div>
    <div class="container">
      <div class="row header" v-if="isLoggedIn()">
        <div class="col-sm-6">
          <button type="button" class="btn btn-link" @click="logout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg></button>
        </div>
        <div class="col-sm-6 text-sm-right">
          <router-link :to="{name: 'index'}" class="btn btn-link" v-if="$route.name=='settings'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z" fill="none"/></svg></router-link>
        </div>
      </div>
    </div>
    
    <main role="main" class="container">
      <loading v-if="!ready" />

      <div class="row" v-if="ready">
        <div class="col-md-12">
          <h4 class="mb-0">Personal Information</h4>
          <form @submit.prevent="changeInfo">
            <div class="row">
              <div class="col-md-4 mb-3">
                <input type="text" class="form-control" v-model="entry.name" placeholder="Full Name" />
              </div>

              <div class="col-md-4 mb-3">
                <input type="email" class="form-control" v-model="entry.email" placeholder="Email address" />
              </div>

              <div class="col-md-4 mb-3">
                <button class="btn btn-dark btn-block" type="submit">Update Information</button>
              </div>
            </div>
          </form>

          <hr/>

          <h4 class="mb-0">Password</h4>
          <form @submit.prevent="changePassword">
            <div class="row">
              <div class="col-md-4 mb-3">
                <input type="password" class="form-control" v-model="password" placeholder="Password" required />
              </div>

              <div class="col-md-4 mb-3">
                <input type="password" class="form-control" v-model="password_confirmation" placeholder="Password confirmation" required />
              </div>

              <div class="col-md-4 mb-3">
                <button class="btn btn-dark btn-block" type="submit">Change Password</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: {},
      password: '',
      password_confirmation: '',
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.ready = false

      try {
        let res = await this.$axios.get('auth/me')
        this.entry = res.data

        this.ready = true
      } catch (error) {
        this.$toast.error('Sorry an error occurred')
      }
    },
    async changeInfo() {
      if (this.entry.name == '' || this.entry.email == ''){
        return
      }

      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.patch(`auth/me`, {
          name: this.entry.name,
          email: this.entry.email,
        })

        this.$toast.clear(loading)
        this.$toast.success(res.data.message)
      } catch (error) {
        this.$toast.clear(loading)
        error.response.data.errors.forEach(e => this.$toast.error(e, {timeout: false}));
      }
    },
    async changePassword() {
      if (this.password == '' || this.password_confirmation == ''){
        return
      }
      let loading = this.$toast('Loading...', {position: 'top-left'})

      try {
        let res = await this.$axios.patch(`auth/password`, {
          password: this.password,
          password_confirmation: this.password_confirmation,
        })

        this.$toast.clear(loading)
        this.$toast.success(res.data.message)
      } catch (error) {
        this.$toast.clear(loading)
        error.response.data.errors.forEach(e => this.$toast.error(e, {timeout: false}));
      }
    },
  },
}
</script>
