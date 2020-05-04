<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    if (this.isLoggedIn()) {
      if (!this.hasAnyRole(['driver'])) {
        this.logout()
      }

      window.Echo.private(`company.${this.getUserInfo().company_id}.msg`).listen('.company-msg', data => {
        this.$swal(data.msg)
      })
    }
  }
};
</script>

<style lang="scss">
body {
  background-color: #e1e1e1 !important;
  font-family: Roboto, sans-serif;
  padding-bottom: 50px;
}
.container {
  background-color: #fff;
  border-radius: 3px;
  -webkit-box-shadow: 0px 10px 26px 0px rgba(0, 0, 0, 0.45);
  -moz-box-shadow: 0px 10px 26px 0px rgba(0, 0, 0, 0.45);
  box-shadow: 0px 10px 26px 0px rgba(0, 0, 0, 0.45);
  margin-top: 35px;
  .header {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 50px;
  }
  .tasks {
    .row {
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 0px;
    }
  }
  .row {
    padding: 20px 0px;
  }
}

.form-date {
  display: block;
  text-align: center !important;
  width: 100%;
  cursor: pointer;
  font-family: Roboto, sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  border: 0px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.pointer {
  cursor: pointer;
}
</style>