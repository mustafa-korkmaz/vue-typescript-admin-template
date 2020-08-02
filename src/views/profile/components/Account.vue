<template>
  <el-form
    ref="passwordForm"
    v-loading="loading"
    :model="passwordForm"
    :rules="rules"
  >
    <el-form-item
      prop="password"
      :label="$t('profileView.password')"
    >
      <el-input
        v-model="passwordForm.password"
        type="password"
      />
    </el-form-item>
    <el-form-item
      prop="confirmPassword"
      :label="$t('profileView.newPassword')"
    >
      <el-input
        v-model="passwordForm.confirmPassword"
        type="password"
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
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import settings from '@/settings'
import { changePassword } from '@/api/user/account-service'

const { notificationDuration } = settings

@Component({
  name: 'Account'
})
export default class extends Vue {
  private rules = {}
  private passwordForm = {
    password: '',
    confirmPassword: ''
  }

  private loading = false

  get passwordConfirmationRequired() {
    return this.$t('signup.passwordConfirmationRequired')
  }

  get passwordRequired() {
    return this.$t('login.passwordRequired')
  }

  created() {
    this.rules = {
      password: [{
        validator: (rule: any, value: string, callback: Function) => {
          this.validatePassword(rule, value, callback, this.passwordRequired.toString())
        },
        trigger: ['blur', 'change']
      }],
      confirmPassword: [{
        validator: (rule: any, value: string, callback: Function) => {
          this.validateConfirmPassword(rule, value, callback, this.passwordConfirmationRequired.toString())
        },
        trigger: ['blur', 'change']
      }]
    }
  }

  private submit() {
    (this.$refs.passwordForm as Form).validate(async(valid) => {
      if (valid) {
        this.loading = true

        changePassword(this.passwordForm.password)
          .then(
            () => {
              this.loading = false
              this.$notify({
                title: this.$t('messages.success').toString(),
                message: this.$t('messages.saved').toString(),
                type: 'success',
                duration: notificationDuration
              })
            },
            (err) => {
              console.error(err)
              this.loading = false
            }
          )
      }
    })
  }

  private validateConfirmPassword = (rule: any, value: string, callback: Function, msg: string) => {
    if (value !== this.passwordForm.password) {
      callback(new Error(msg))
    } else {
      callback()
    }
  }

  private validatePassword = (rule: any, value: string, callback: Function, msg: string) => {
    if (value.length < 6) {
      callback(new Error(msg))
    } else {
      callback()
    }
  }
}
</script>
