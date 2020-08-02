<template>
  <el-form v-loading="loading">
    <el-form-item :label="$t('profileView.title')">
      <el-input v-model="user.title" />
    </el-form-item>
    <el-form-item :label="$t('profileView.authorizedPersonName')">
      <el-input v-model="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input
        v-model.trim="user.email"
        disabled="disabled"
      />
    </el-form-item>
    <el-form-item style="text-align:right">
      <el-button
        type="success"
        icon="el-icon-check"
        @click="submit"
      >
        {{ $t('form.save') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IProfile } from '../index.vue'
import settings from '@/settings'
import { updateInfo } from '@/api/user/account-service'
import { UserModule } from '../../../store/modules/user'

const { notificationDuration } = settings

@Component({
  name: 'Info'
})
export default class extends Vue {
  @Prop({ required: true }) private user!: IProfile

  private loading = false

  private submit() {
    this.loading = true

    const title = this.user.title
    const name = this.user.name
    const payload = { title, name }

    updateInfo(payload.title, payload.name)
      .then(
        () => {
          this.loading = false
          this.$notify({
            title: this.$t('messages.success').toString(),
            message: this.$t('messages.saved').toString(),
            type: 'success',
            duration: notificationDuration
          })

          UserModule.ResetUserInfo(payload)
        },
        (err) => {
          console.error(err)
          this.loading = false
        }
      )
  }
}
</script>
