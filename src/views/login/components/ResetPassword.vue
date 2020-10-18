<template>
  <el-form
    ref="resetPasswordForm"
    :model="resetPasswordForm"
    :rules="resetPasswordRules"
    class="login-form"
    autocomplete="on"
    label-position="left"
  >
    <div class="title-container">
      <h3 class="title">
        {{ $t('resetPassword.title') }}
      </h3>
      <lang-select class="set-language" />
    </div>

    <el-tooltip
      v-model="capsTooltip"
      content="Caps lock is On"
      placement="right"
      manual
    >
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          v-model="resetPasswordForm.password"
          :type="signUpPasswordType"
          :placeholder="$t('resetPassword.password')"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleReset"
        />
        <span
          class="show-pwd"
          @click="showPwdSignUpForm"
        >
          <svg-icon :name="signUpPasswordType === 'password' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>
    </el-tooltip>
    <el-tooltip
      v-model="capsTooltip"
      content="Caps lock is On"
      placement="right"
      manual
    >
      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          v-model="resetPasswordForm.confirmPassword"
          :type="signUpPasswordType"
          :placeholder="$t('signup.confirmPassword')"
          name="confirmPassword"
          tabindex="2"
          autocomplete="on"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleReset"
        />
        <span
          class="show-pwd"
          @click="showPwdSignUpForm"
        >
          <svg-icon :name="signUpPasswordType === 'password' ? 'eye-off' : 'eye-on'" />
        </span>
      </el-form-item>
    </el-tooltip>

    <el-button
      :loading="loading"
      type="primary"
      style="width:100%; margin-bottom:30px;"
      @click.native.prevent="handleReset"
    >
      {{ $t('resetPassword.submit') }}
    </el-button>
    <div style="position:relative">
      <el-link
        class="links"
        style="float:right"
        :underline="false"
        @click="handleLoginPageClick"
      >
        {{ $t('resetPassword.logIn') }}
      </el-link>
    </div>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LangSelect from '@/components/LangSelect/index.vue'
import { ElForm } from 'element-ui/types/form'
import { resetPassword } from '@/api/user/account-service'
import settings from '@/settings'
import { Message } from 'element-ui'

const { notificationDuration } = settings

@Component({
  name: 'ResetPassword',
  components: { LangSelect }
})
export default class extends Vue {
  private resetPasswordForm = {
    password: '',
    confirmPassword: ''
  }

  private signUpPasswordType = 'password'
  private loading = false
  private demoLoading = false
  private capsTooltip = false
  private resetPasswordRules = {}

  get passwordRequired() {
    return this.$t('login.passwordRequired')
  }

  get emailRequired() {
    return this.$t('login.emailRequired')
  }

  get passwordConfirmationRequired() {
    return this.$t('signup.passwordConfirmationRequired')
  }

  created() {
    this.resetPasswordRules = {
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

  private validatePassword = (rule: any, value: string, callback: Function, msg: string) => {
    if (value.length < 6) {
      callback(new Error(msg))
    } else {
      callback()
    }
  }

  private validateConfirmPassword = (rule: any, value: string, callback: Function, msg: string) => {
    if (value !== this.resetPasswordForm.password) {
      callback(new Error(msg))
    } else {
      callback()
    }
  }

  private showPwdSignUpForm() {
    if (this.signUpPasswordType === 'password') {
      this.signUpPasswordType = ''
    } else {
      this.signUpPasswordType = 'password'
    }
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e

    if (key === undefined) {
      return
    }
    this.capsTooltip = key !== null && key.length === 1 && (key >= 'A' && key <= 'Z')
  }

  private handleReset() {
    (this.$refs.resetPasswordForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        const securityCode = this.$route.query.code

        if (securityCode == null) {
          Message({
            message: this.$t('resetPassword.securityCodeNotFound').toString(),
            type: 'error',
            duration: notificationDuration
          })
          return
        }

        this.loading = true

        resetPassword(this.resetPasswordForm.password, securityCode.toString())
          .then(
            () => {
              this.loading = false
              Message({
                message: this.$t('resetPassword.saved').toString(),
                type: 'success',
                duration: notificationDuration
              })
              setTimeout(() => {
                this.$router.push('/login')
              }, notificationDuration)
            },
            (err) => {
              console.error(err)
              this.loading = false
            }
          )
      }
    })
  }

  private handleLoginPageClick() {
    this.$emit('loginPageClicked')
  }
}
</script>

<style scoped>
</style>
