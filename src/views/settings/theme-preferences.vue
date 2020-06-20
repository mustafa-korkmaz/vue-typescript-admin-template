<template>
  <div class="page-container">
    <el-form
      ref="postForm"
      :model="postForm"
      class="form-container"
    >
      <el-row>
        <el-col :span="16">
          <settings />
        </el-col>
        <el-col :span="16">
          <el-form-item
            prop="create"
            class="form-buttons"
          >
            <el-button
              icon="el-icon-check"
              type="primary"
              @click="handleFilter"
            >
              {{ $t('form.saveChanges') }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as service from '@/api/parameters/parameter-service'
import { getPriceText } from '@/utils/index'
import MaterialInput from '@/components/MaterialInput/index.vue'
import { MessageBox, Form } from 'element-ui'
import settings from '@/settings'
import Pagination from '@/components/Pagination/index.vue'
import { IParameter } from '@/api/parameters/types'
import { ParameterTypeId } from '@/utils/enums'
import { Settings } from '@/layout/components'

const { notificationDuration } = settings

@Component({
  name: 'Parameter',
  components: {
    MaterialInput,
    Pagination,
    Settings
  }
})
export default class extends Vue {
  private postForm = Object.assign({}, service.defaultParameter)
  private query = Object.assign({}, service.defaultParameterQuery)
  private selectedParameter = Object.assign({}, service.defaultParameter)

  private tableKey = 0
  private list: IParameter[] = []
  private total = 0
  private page = 1
  private loading = true
  private editMode = false
  private dialogFormVisible = false
  private rules = {}
  private getPriceText = getPriceText

  created() {
    this.rules = {
      order: [{ required: true, message: this.orderRequired, trigger: 'change' }],
      parameter_type_id: [{ required: true, message: this.debtOrReceivableRequired, trigger: 'change' }],
      name: [{ required: true, message: this.titleRequired, trigger: 'blur' }]
    }
    this.getList()
  }

  get titleRequired() {
    return this.$t('transactionTypesView.nameRequired')
  }

  get debtOrReceivableRequired() {
    return this.$t('transactionTypesView.debtOrReceivableRequired')
  }

  get orderRequired() {
    return this.$t('transactionTypesView.orderRequired')
  }

  get options() {
    return [{
      value: ParameterTypeId.TransactionType_Receivable,
      label: this.$t('transactionTypesView.receivable')
    }, {
      value: ParameterTypeId.TransactionType_Debt,
      label: this.$t('transactionTypesView.debt')
    }]
  }

  private getList() {
    this.loading = true
    this.query.offset = (this.page - 1) * this.query.limit
    this.query.name = this.postForm.name

    service.getParameters(this.query)
      .then(
        (resp) => {
          this.loading = false
          this.list = resp.data.items
          this.total = resp.data.records_total
        },
        (err) => {
          console.error(err)
          this.loading = false
        }
      )
  }

  private handleFilter() {
    this.page = 1
    this.getList()
  }

  private handleUpdate(row: any) {
    this.selectedParameter = Object.assign({}, row)
    this.editMode = true
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private handleDelete(row: IParameter) {
    MessageBox.confirm(
      this.$t('transactionTypesView.deleteParameterWarning').toString(),
      this.$t('messages.confirm').toString(),
      {
        confirmButtonText: this.$t('form.delete').toString(),
        cancelButtonText: this.$t('form.cancel').toString(),
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }
    ).then(() => {
      this.deleteParameter(row)
    })
  }

  private handleCreate() {
    this.editMode = false
    this.dialogFormVisible = true
    this.selectedParameter = Object.assign({}, service.defaultParameter)
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private getDialogTitle() {
    return this.editMode ? this.$t('transactionTypesView.updateTransactionType')
      : this.$t('transactionTypesView.createTransactionType')
  }

  private createParameter() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.loading = true
        service.createParameter(this.selectedParameter)
          .then(
            (resp) => {
              this.loading = false
              this.selectedParameter.id = resp.data
              this.total += 1
              this.list.unshift(this.selectedParameter)
              this.dialogFormVisible = false
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

  private updateParameter() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.loading = true
        service.updateParameter(this.selectedParameter)
          .then(
            () => {
              this.loading = false
              const index = this.list.findIndex(v => v.id === this.selectedParameter.id)
              this.list.splice(index, 1, this.selectedParameter)
              this.dialogFormVisible = false
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

  private deleteParameter(p: IParameter) {
    this.loading = true

    if (p.id === null) {
      console.error('parameter id cannot be null')
      return
    }

    service.deleteParameter(p.id)
      .then(
        () => {
          this.loading = false
          const index = this.list.findIndex(v => v.id === p.id)
          this.total -= 1
          this.list.splice(index, 1)
          this.$notify({
            title: this.$t('messages.success').toString(),
            message: this.$t('messages.deleted').toString(),
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

  private getTransactionTypeAccountingText(parameterTypeId: ParameterTypeId) {
    switch (parameterTypeId) {
      case ParameterTypeId.TransactionType_Receivable:
        return this.$t('transactionTypesView.receivable')
      case ParameterTypeId.TransactionType_Debt:
        return this.$t('transactionTypesView.debt')
    }
  }
}
</script>
