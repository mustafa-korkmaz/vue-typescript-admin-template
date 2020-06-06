<template>
  <el-form
    v-if="showSignupForm"
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
      @click.native.prevent="handleLogin"
    >
      {{ $t('signup.submit') }}
    </el-button>
    <div style="position:relative">
      <el-button
        :loading="demoLoading"
        style="float:left"
        type="success"
        @click="handleDemoLogin"
      >
        {{ $t('login.tryDemo') }}
      </el-button>
      <el-button
        style="float:right"
        type="primary"
        @click="showDialog=true"
      >
        {{ $t('login.thirdparty') }}
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'SignUp'
})
export default class extends Vue {
  @Prop({ default: false }) private visible!: boolean

 private signupForm = {
   email: '',
   password: '',
   confirmPassword: ''
 }

  private signupRules = {}
  private columnSelectionOptionActivated = false
  private selectedOptionalColumns: string[] = []

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
      password: [{ validator: this.validatePassword, trigger: ['blur', 'change'] }],
      confirmPassword: [{
        validator: (rule: any, value: string, callback: Function) => {
          this.validateConfirmPassword(rule, value, callback, this.passwordConfirmationRequired.toString())
        },
        trigger: 'blur'
      }]
    }
  }

 private validatePassword = (rule: any, value: string, callback: Function, msg: string) => {
   console.log(this)
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
}
</script>

<style scoped>
</style>
