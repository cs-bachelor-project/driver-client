<template>
  <div>
    <div class="container">
      <div class="row text-center" v-if="!isLoggedIn()">
        <div class="col-sm-12">
          <h3>Login</h3>
        </div>
      </div>
    </div>
    
    <main role="main" class="container">
    <div class="row">
      <div class="col-sm-12">
        <form @submit.prevent="login">
          <div class="form-group">
            <input type="email" class="form-control" placeholder="Email address" required v-model="data.email" />
          </div>
          <div class="form-group">
            <input type="password" class="form-control" placeholder="Password" required v-model="data.password" />
          </div>
          <button type="submit" class="btn btn-lg btn-block btn-dark">Login</button>
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
      data: {
        email: '',
        password: '',
        type: 'driver',
      },
    }
  },
  methods: {
    async login() {
      let loading = this.$toast('Loading...', {position: 'top-left'})
      
      try {
        let res = await this.$axios.post('auth/login', this.data)

        this.setAuthToken(res.data.access_token)

        this.$toast.clear(loading)
        this.$router.push({name: 'index'})
      } catch (error) {
        this.$toast.clear(loading)
        this.$toast.error(error.response.data.message)
      }
    }
  },
}
</script>