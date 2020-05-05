<template>
  <div>
    <div class="container">
      <div class="row header" v-if="isLoggedIn()">
        <div class="col-sm-4 my-sm-auto">
          <button type="button" class="btn btn-link" @click="logout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg></button>
        </div>
        <div class="col-sm-4 my-sm-auto text-center"><datetime format="cccc, dd LLLL yyyy" input-class="form-date" type="date" v-model="date"></datetime></div>
        <div class="col-sm-4 my-sm-auto text-sm-right">
          <router-link :to="{name: 'settings'}" class="btn btn-link" v-if="$route.name=='index'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/><path d="M0 0h24v24H0z" fill="none"/></svg></router-link>
        </div>
      </div>
    </div>

    <main role="main" class="container">
      <loading v-if="!ready" />

      <div class="row text-center" v-if="ready && !entries.length">
        <div class="col">
          We didn't find anything - just empty space.
        </div>
      </div>

      <div class="tasks" v-if="ready">
        <div class="row" v-for="(detail, index) in entries" :key="index">
          <div class="my-sm-auto my-2 col-sm-1"><svg v-if="detail.action == 'pick'" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M2.5,19h19v2h-19V19z M22.07,9.64c-0.21-0.8-1.04-1.28-1.84-1.06L14.92,10l-6.9-6.43L6.09,4.08l4.14,7.17l-4.97,1.33 l-1.97-1.54l-1.45,0.39l2.59,4.49c0,0,7.12-1.9,16.57-4.43C21.81,11.26,22.28,10.44,22.07,9.64z"/></g></g></g></svg>
          <svg v-if="detail.action == 'drop'" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M2.5,19h19v2h-19V19z M19.34,15.85c0.8,0.21,1.62-0.26,1.84-1.06c0.21-0.8-0.26-1.62-1.06-1.84l-5.31-1.42l-2.76-9.02 L10.12,2v8.28L5.15,8.95L4.22,6.63L2.77,6.24v5.17L19.34,15.85z"/></g></g></g></svg></div>
          <div class="my-sm-auto my-2 col-sm">{{detail.task.person_name}}</div>
          <div class="my-sm-auto my-2 col-sm"><a :href='`https://www.google.com/maps/dir/Current+Location/${detail.street}+${detail.street_number}+${detail.postal}+${detail.city}`' target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#527bff" width="20px" height="20px"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg> {{detail.street}} {{detail.street_number}} {{detail.postal}} {{detail.city}}</a></div>
          <div class="my-sm-auto my-2 col-sm" :title="utcToLocal(detail.scheduled_at)">{{utcToLocal(detail.scheduled_at).format('HH:mm')}} ({{utcToLocal(detail.scheduled_at).fromNow()}})</div>
          <div class="my-sm-auto my-2 col-sm"><a :href="`tel:${detail.phone}`" class="btn btn-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#527bff" width="20px" height="20px"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg> {{detail.phone}}</a></div>
          <div class="my-sm-auto my-2 col-sm pointer" @click="$swal(detail.task.note)">{{subNote(detail.task.note)}}</div>
          <div class="my-sm-auto my-2 col-sm-1 text-right">
            <div>
              <span class="pointer" title="Mark as cancelled" @click="cancel(index, detail.task.id)" v-if="detail.action == 'pick'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg></span>
              
              <span class="pointer" title="Mark as completed" @click="complete(index, detail.id)" v-if="detail.completed_at == null"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="28px" height="28px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/></svg></span>
              <span v-if="detail.completed_at != null" :title="utcToLocal(detail.completed_at)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="28px" height="28px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.77 5.03l1.4 1.4L8.43 19.17l-5.6-5.6 1.4-1.4 4.2 4.2L19.77 5.03m0-2.83L8.43 13.54l-4.2-4.2L0 13.57 8.43 22 24 6.43 19.77 2.2z"/></svg></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entries: [],
      date: '',
    }
  },
  created() {
    this.date = this.moment().toISOString();

    window.Echo.private(`task.of.${this.getUserInfo().sub}`).listen('.assigned', (data) => {
      delete data.socket
      data = Object.values(data)

      this.$toast.success(`${data[0].task.person_name} has been assigned to you`)

      this.entries.push(...data)
        
      this.entries.sort((a, b) => (a.scheduled_at > b.scheduled_at) ? 1 : -1)
    }).listen('.unassigned', (data) => {
      this.$toast.success(`${data.person_name} was removed`)

      this.entries = this.entries.filter(entry => entry.task.id !== data.id)
    }).listen('.updated', (data) => {
      delete data.socket
      data = Object.values(data)

      this.$toast.success(`${data[0].task.person_name} was updated`)
      
      data.forEach((e) => {
        this.entries[this.entries.findIndex(entry => entry.id == e.id)] = e
      })

      this.entries.sort((a, b) => (a.scheduled_at > b.scheduled_at) ? 1 : -1)
    })
  },
  methods: {
    async loadData() {
      this.ready = false

      try {
        let res = await this.$axios.get(`drivers/tasks/details?include=task&date=${this.fDate}`)

        this.entries = res.data.data

        this.ready = true
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    async complete(index, id) {
      try {
        let box = await this.$swal({
          title: 'Mark as completed',
          input: 'text',
          showCancelButton: true,
          inputValue: this.moment().format('YYYY-MM-DD HH:mm'),
          inputValidator: value => {
            if (!value) {
              return 'Time for completion is missing'
            }
          }
        })

        if (box.value) {
            let res = await this.$axios.patch(`drivers/tasks/details/${id}`, {completed_at: this.moment(box.value)})

            if(res) {
              this.entries[index].completed_at = this.moment(box.value).utc()
              this.$toast.success('Marked as completed')
            }
        }
      } catch (error) {
        this.$toast.error('Sorry an error occurred')
      }
    },
    async cancel(index, id) {
      try {
        let box = await this.$swal({
          title: 'Why couldn\'t you pick up the passenger?',
          input: 'select',
            inputOptions: {
            'Cancelled on site': 'Cancelled on site',
          },
          showCancelButton: true,
          inputValidator: value => {
            if (!value) {
              return 'Reason missing'
            }
          }
        })

        if (box.value) {
          let res = await this.$axios.post(`drivers/tasks/${id}/cancellations`, {reason: box.value})

          if(res) {
            this.$toast.success('Marked as cancelled')

            this.entries = this.entries.filter(entry => entry.task.id !== id)
          }
        }
      } catch (error) {
        this.$toast.error('Sorry an error occurred')
      }
    },
    subNote(note, limit=75) {
      if (note.length > limit) {
        return note.substring(0, limit) + '...'
      }

      return note
    },
  },
  computed: {
    fDate() {
      return this.date.split('T')[0]
    }
  },
  watch: {
    date: function () {
      this.loadData()
    } 
  },
}
</script>