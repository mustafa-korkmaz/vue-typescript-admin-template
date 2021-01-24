import { MessageBox } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'PremiumSubscriptionErrorMixin'
})
export default class extends Vue {
  public showPaidUserError() {
    const url = process.env.VUE_APP_LANDING_PAGE_URL + '#pricing'
    MessageBox.confirm(
      this.$t('paidUserErrorView.description').toString(),
      this.$t('paidUserErrorView.title').toString(),
      {
        confirmButtonText: this.$t('paidUserErrorView.action').toString(),
        cancelButtonText: this.$t('form.cancel').toString(),
        confirmButtonClass: 'el-button--primary',
        type: 'warning'
      }
    ).then(() => {
      window.open(url)
    })
  }
}
