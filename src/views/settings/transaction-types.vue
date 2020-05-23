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
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
              @enterPressed="handleFilter"
            >
              {{ $t('transactionTypes.name') }}
            </material-input>
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
          :label="$t('transactionTypes.name')"
          min-width="40"
        >
          <template slot-scope="{row}">
            <span>{{ getTransactionTypeText(row.name) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="20"
          align="center"
        >
          <template slot="header">
            <el-tooltip
              :content="$t('transactionTypes.debtOrReceivableTooltip')"
              effect="dark"
              placement="right"
            >
              <span>{{ $t('transactionTypes.debtOrReceivable') }}</span>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>{{ getTransactionTypeAccountingText(row.name) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('transactionTypes.order')"
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
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('customersView.title')"
          prop="title"
        >
          <el-input
            v-model="selectedParameter.name"
            :placeholder="$t('customersView.titlePlaceholder')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('customersView.authorizedPersonName')"
          prop="authorizedPerson"
        >
          <el-input v-model="selectedParameter.authorized_person_name" />
        </el-form-item>
        <el-form-item
          :label="$t('customersView.phoneNumber')"
          prop="phone"
        >
          <el-input
            v-model="selectedParameter.phone_number"
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
import { IParameter } from '../../api/parameters/types'

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

  // todo: toggle sort by title buttons

  created() {
    this.rules = {
      // type: [{ required: true, message: 'type is required', trigger: 'change' }],
      // timestamp: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
      name: [{ required: true, message: this.titleRequired, trigger: 'blur' }]
    }
    this.getList()
  }

  get titleRequired() {
    return this.$t('transactionTypes.nameRequired')
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
      this.$t('transactionTypes.deleteParameterWarning').toString(),
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
    return this.editMode ? this.$t('transactionTypes.updateTransactionType')
      : this.$t('transactionTypes.createTransactionType')
  }

  private createParameter() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
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

  private getTransactionTypeText(name: string) {
    return name.substring(2) // for B-Payment take Payment
  }

  private getTransactionTypeAccountingText(name: string) {
    const type = name.substring(0, 1) // for B-Payment take Borc or Debt
    if (type === 'A') {
      return this.$t('transactionTypes.receivable')
    }

    return this.$t('transactionTypes.debt')
  }
}
</script>
