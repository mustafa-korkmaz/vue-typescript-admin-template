<template>
  <el-form
    ref="signupForm"
    :model="signupForm"
    :rules="signupRules"
    class="login-form"
    autocomplete="on"
    label-position="left"
  >
    <div class="title-container">
      <h3 class="title">
        {{ $t('signup.title') }}
      </h3>
      <lang-select class="set-language" />
    </div>

    <el-form-item prop="email">
      <span class="svg-container">
        <svg-icon name="email" />
      </span>
      <el-input
        ref="signupEmail"
        v-model="signupForm.email"
        :placeholder="$t('signup.email')"
        name="username"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
    </el-form-item>

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
          v-model="signupForm.password"
          :type="signUpPasswordType"
          :placeholder="$t('signup.password')"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleRegister"
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
          v-model="signupForm.confirmPassword"
          :type="signUpPasswordType"
          :placeholder="$t('signup.confirmPassword')"
          name="confirmPassword"
          tabindex="2"
          autocomplete="on"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
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
      @click.native.prevent="handleRegister"
    >
      {{ $t('signup.submit') }}
    </el-button>
    <div style="position:relative">
      <el-link
        class="links"
        style="float:right"
        :underline="false"
        @click="handleLoginPageClick"
      >
        {{ $t('signup.logIn') }}
      </el-link>
    </div>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import LangSelect from '@/components/LangSelect/index.vue'
import { UserModule } from '@/store/modules/user'
import { ElForm } from 'element-ui/types/form'
import { Dictionary, Route } from 'vue-router/types/router'

@Component({
  name: 'SignupForm',
  components: { LangSelect }
})
export default class extends Vue {
  private signupForm = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  private signUpPasswordType = 'password'
  private loading = false
  private demoLoading = false
  private capsTooltip = false
  private signupRules = {}

  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

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
    this.signupRules = {
      email: [{ type: 'email', message: this.emailRequired, trigger: ['blur', 'change'] }],
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
    if (value !== this.signupForm.password) {
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

  private handleRegister() {
    (this.$refs.signupForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        const lang = this.$i18n.locale

        const payload = { ...this.signupForm, lang }

        UserModule.Register(payload)
          .then(() => {
            this.$router.push({
              path: this.redirect || '/',
              query: this.otherQuery
            })
          })
          .finally(() => {
            this.loading = false
          })
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }

  private handleLoginPageClick() {
    this.$emit('loginPageClicked')
  }
}
</script>

<style scoped>
</style>
