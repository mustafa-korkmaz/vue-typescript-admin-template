<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <pan-thumb
        :image="avatar"
        style="float: left"
      >
        {{ getGreeting() }}
        <span>
          {{ $t('dashboardView.boss') }}
        </span>
      </pan-thumb>
      <div class="info-container">
        <span class="display_name">{{ title }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Dashboard</span>
      </div>
    </div>
    <div>
      <img
        :src="emptyGif"
        class="emptyGif"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import PanThumb from '@/components/PanThumb/index.vue'
import GithubCorner from '@/components/GithubCorner/index.vue'
import { getDashboard } from '@/api/user/account-service'

@Component({
  name: 'DashboardEditor',
  components: {
    PanThumb,
    GithubCorner
  }
})
export default class extends Vue {
  private emptyGif = 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'

  created() {
    getDashboard()
      .then(
        (resp) => {
          console.log(resp)
        },
        (err) => {
          console.error(err)
        }
      )
  }

  get title() {
    return UserModule.title || UserModule.name || UserModule.email
  }

  get avatar() {
    return UserModule.avatar
  }

  get roles() {
    return UserModule.roles
  }

  getGreeting() {
    const d = new Date()
    const h = d.getHours()

    if (h > 5 && h < 12) {
      return this.$t('dashboardView.goodMorning')
    } else
    if (h >= 12 && h < 17) {
      return this.$t('dashboardView.goodDay')
    }

    return this.$t('dashboardView.goodEvening')
  }
}
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;

  .info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }

  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;

    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
