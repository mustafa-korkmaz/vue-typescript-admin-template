<template>
  <div class="login-container">
    <el-form
      v-if="showLoginForm"
      ref="loginForm"
      v-loading="formLoading"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon name="email" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          :placeholder="$t('login.email')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        :content="$t('login.capsLockOn')"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-link
        class="links forgot-password"
        :underline="false"
        @click="showForgotPasswordPage"
      >
        {{ $t('login.forgotPassword') }}
      </el-link>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

      <el-divider class="divider">
        {{ $t('login.or') }}
      </el-divider>

      <el-link
        class="links block"
        :underline="false"
        @click="handleFacebookSignIn"
      >
        <svg-icon name="facebook" />
        {{ $t('login.facebook') }}
      </el-link>
      <el-link
        class="links block"
        :underline="false"
        @click="handleGoogleSignIn"
      >
        <svg-icon name="google2" />
        {{ $t('login.gmail') }}
      </el-link>

      <div style="position:relative">
        <el-link
          class="links"
          style="float:left"
          :underline="false"
          @click="handleDemoLogin"
        >
          {{ $t('login.tryDemo') }}
        </el-link>
        <el-link
          class="links"
          style="float:right"
          :underline="false"
          @click="showRegisterPage"
        >
          {{ $t('login.register') }}
        </el-link>
      </div>
    </el-form>

    <signup
      v-if="showSignupForm"
      @loginPageClicked="showLoginPage"
    />

    <forgot-password
      v-if="showForgotPasswordForm"
      @loginPageClicked="showLoginPage"
    />

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input, Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import settings from '@/settings'
import Signup from './components/SignupForm.vue'
import firebase from 'firebase/app'
import 'firebase/auth'

const { notificationDuration } = settings

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign,
    Signup,
    ForgotPassword
  }
})
export default class extends Vue {
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

  private loginForm = {
    email: '',
    password: ''
  }

  private signupForm = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  private loginRules = {}
  private signupRules = {}
  private formLoading = false
  private showLoginForm = true
  private showSignupForm = false
  private showForgotPasswordForm = false
  private passwordType = 'password'
  private signUpPasswordType = 'password'
  private loading = false
  private demoLoading = false
  private showDialog = false
  private capsTooltip = false
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

  created() {
    this.loginRules = {
      email: [{ type: 'email', required: true, message: this.emailRequired, trigger: ['blur', 'change'] }],
      password: [{
        validator: (rule: any, value: string, callback: Function) => {
          this.validatePassword(rule, value, callback, this.passwordRequired.toString())
        },
        trigger: 'blur'
      }]
    }
  }

  mounted() {
    if (this.loginForm.email === '') {
      (this.$refs.email as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  get passwordRequired() {
    return this.$t('login.passwordRequired')
  }

  get emailRequired() {
    return this.$t('login.emailRequired')
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e

    if (key === undefined) {
      return
    }
    this.capsTooltip = key !== null && key.length === 1 && (key >= 'A' && key <= 'Z')
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.loading = true

        UserModule.Login(this.loginForm)
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

  private handleDemoLogin() {
    this.formLoading = true
    UserModule.DemoLogin(this.$i18n.locale)
      .then(() => {
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        })
      })
      .finally(() => {
        this.demoLoading = false
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

  private showRegisterPage() {
    this.showLoginForm = false
    this.showSignupForm = true
    this.showForgotPasswordForm = false
  }

  private showLoginPage() {
    this.showLoginForm = true
    this.showSignupForm = false
    this.showForgotPasswordForm = false
  }

  private showForgotPasswordPage() {
    this.showLoginForm = false
    this.showSignupForm = false
    this.showForgotPasswordForm = true
  }

  private socialLoginError() {
    Message({
      message: this.$t('errorMessages.socialMediaProviderFailure').toString(),
      type: 'error',
      duration: notificationDuration
    })
  }

  private handleGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider()

    this.handleSocialLogin(provider)
  }

  private handleFacebookSignIn() {
    Message({
      message: this.$t('login.comingSoon').toString(),
      type: 'info',
      duration: notificationDuration
    })
  }

  private handleSocialLogin(provider: any) {
    this.loading = true
    firebase.auth()
      .signInWithPopup(provider)
      .then((res) => {
        if (res.user) {
          res.user.getIdToken(/* forceRefresh */ true).then((idToken) => {
            Message({
              message: this.$t('login.socialLoginSuccess').toString(),
              type: 'success',
              duration: notificationDuration
            })
            UserModule.SocialLogin(idToken)
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
              })
          })
        } else {
          this.loading = false
          this.socialLoginError()
        }
      },
      (err) => {
        console.error(err)
        this.socialLoginError()
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss">
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 5em 2em 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .el-divider__text {
    background-color: $loginBg;
    color: #fff;
  }
  .divider {
    background: $darkGray;
  }

  .links {
    &.forgot-password {
      float: right;
    }
    &.block {
      display: block;
      text-align: center;
      padding-bottom: 2em;
    }
    color: #fff;
    padding-bottom: 1em;
    padding-right: 0.4em;
    &:hover {
      color: $lightGray;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
