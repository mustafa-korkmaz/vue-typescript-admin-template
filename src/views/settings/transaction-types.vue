<template>
  <div class="page-container">
    <el-form
      ref="postForm"
      :model="postForm"
      class="form-container"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item prop="name">
            <material-input
              id="name"
              v-model="postForm.name"
              :maxlength="100"
              name="name"
              required
              @enterPressed="handleFilter"
            >
              {{ $t('transactionTypesView.name') }}
            </material-input>
          </el-form-item>
        </el-col>
        <el-col style="display:none">
          <el-form-item prop="">
            <material-input
              id="order"
              v-model="postForm.order"
              :maxlength="100"
              name="order"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            prop="create"
            class="form-buttons"
          >
            <el-button
              icon="el-icon-circle-plus-outline"
              type="success"
              @click="handleCreate"
            >
              {{ $t('form.create') }}
            </el-button>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="handleFilter"
            >
              {{ $t('form.search') }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form />
    </el-form>
    <el-row>
      <el-table
        :key="tableKey"
        v-loading="loading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('transactionTypesView.name')"
          min-width="40"
        >
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="20"
          align="center"
        >
          <template slot="header">
            <el-tooltip
              :content="$t('transactionTypesView.debtOrReceivableTooltip')"
              effect="dark"
              placement="right"
            >
              <span>{{ $t('transactionTypesView.debtOrReceivable') }}</span>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>{{ getTransactionTypeAccountingText(row.parameter_type_id) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('transactionTypesView.order')"
          align="center"
          min-width="20"
        >
          <template
            slot-scope="{row}"
            text-align="right"
          >
            <span>{{ row.order }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('tableActions.name')"
          align="center"
          min-width="20"
          class-name="fixed-width"
        >
          <template slot-scope="{row}">
            <el-button-group>
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(row)"
              >
                {{ $t('tableActions.edit') }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(row)"
              >
                {{ $t('tableActions.delete') }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="query.limit"
        @pagination="getList"
      />
    </el-row>
    <el-dialog
      :title="getDialogTitle()"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="selectedParameter"
        label-position="top"
        label-width="100px"
        class="single-item"
      >
        <el-form-item
          :label="$t('transactionTypesView.name')"
          prop="name"
        >
          <el-input
            v-model="selectedParameter.name"
            :placeholder="$t('transactionTypesView.namePlaceholder')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('transactionTypesView.debtOrReceivableTooltip')"
          prop="parameter_type_id"
        >
          <el-select
            v-model="selectedParameter.parameter_type_id"
            clearable
            :placeholder="$t('form.select')"
            :disabled="editMode"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="order">
          <label slot="label">
            <el-tooltip
              :content="$t('transactionTypesView.orderLabelTooltip')"
              effect="dark"
              placement="right"
            >
              <span>{{ $t('transactionTypesView.order') }}</span>
            </el-tooltip>
          </label>
          <el-input
            v-model="selectedParameter.order"
            type="number"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('form.cancel') }}
        </el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          @click="editMode?updateParameter():createParameter()"
        >
          {{ $t('form.save') }}
        </el-button>
      </div>
    </el-dialog>
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

const { notificationDuration } = settings

@Component({
  name: 'Parameter',
  components: {
    MaterialInput,
    Pagination
  }
})
export default class extends Vue {
  private postForm = Object.assign({}, service.defaultParameter)
  private query = Object.assign({}, service.defaultParameterQuery)
  private selectedParameter = Object.assign({}, { ...service.defaultParameter, transactionType: '' })

  private tableKey = 0
  private list: IParameter[] = []
  private total = 0
  private page = 1
  private loading = true
  private editMode = false
  private dialogFormVisible = false
  private rules = {}
  private getPriceText = getPriceText

  // todo: toggle sort by title buttons

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
    this.selectedParameter = Object.assign({}, { ...service.defaultParameter, transactionType: '' })
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
      } else {
        console.log('no valid')
      }
    })
  }

  private updateParameter() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.loading = true
        console.log(this.selectedParameter)
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
