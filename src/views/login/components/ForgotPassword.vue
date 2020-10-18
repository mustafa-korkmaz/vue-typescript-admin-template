<template>
  <el-form
    ref="forgotPasswordForm"
    :model="forgotPasswordForm"
    :rules="forgotPasswordRules"
    class="login-form"
    autocomplete="on"
    label-position="left"
  >
    <div class="title-container">
      <h3 class="title">
        {{ $t('forgotPassword.title') }}
      </h3>
      <lang-select class="set-language" />
    </div>

    <el-form-item prop="email">
      <span class="svg-container">
        <svg-icon name="email" />
      </span>
      <el-input
        ref="email"
        v-model="forgotPasswordForm.email"
        :placeholder="$t('forgotPassword.email')"
        name="username"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
    </el-form-item>
    <el-button
      :loading="loading"
      type="primary"
      style="width:100%; margin-bottom:30px;"
      @click.native.prevent="handleForgotPasword"
    >
      {{ $t('forgotPassword.submit') }}
    </el-button>
    <div style="position:relative">
      <el-link
        class="links"
        style="float:right"
        :underline="false"
        @click="handleLoginPageClick"
      >
        {{ $t('forgotPassword.logIn') }}
      </el-link>
    </div>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LangSelect from '@/components/LangSelect/index.vue'
import { ElForm } from 'element-ui/types/form'
import { resetAccount } from '@/api/user/account-service'

@Component({
  name: 'ForgotPassword',
  components: { LangSelect }
})
export default class extends Vue {
  private forgotPasswordForm = {
    email: ''
  }

  private loading = false
  private forgotPasswordRules = {}

  get emailRequired() {
    return this.$t('login.emailRequired')
  }

  created() {
    this.forgotPasswordRules = {
      email: [{ type: 'email', required: true, message: this.emailRequired, trigger: ['blur', 'change'] }]
    }
  }

  private handleForgotPasword() {
    (this.$refs.forgotPasswordForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        resetAccount(this.forgotPasswordForm.email)
          .then(
            () => {
              this.loading = false

              const msg = this.$t('forgotPassword.resetPasswordLinkSent', [this.forgotPasswordForm.email])

              this.$message({
                message: msg.toString(),
                type: 'success'
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

  private handleLoginPageClick() {
    this.$emit('loginPageClicked')
  }
}
</script>

<style scoped>
</style>
