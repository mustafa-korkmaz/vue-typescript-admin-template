<template>
  <div class="page-container">
    <el-form
      ref="postForm"
      :model="postForm"
      class="form-container"
    >
      <el-row>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
        >
          <el-form-item prop="title">
            <material-input
              id="title"
              v-model="postForm.title"
              :maxlength="100"
              name="title"
              required
              @enterPressed="handleFilter"
            >
              {{ $t('customersView.title') }}
            </material-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="8"
          :lg="8"
        >
          <el-form-item prop="authorized_person_name">
            <material-input
              id="authorized_person_name"
              v-model="postForm.authorized_person_name"
              :maxlength="100"
              name="authorized_person_name"
              required
              @enterPressed="handleFilter"
            >
              {{ $t('customersView.authorizedPersonName') }}
            </material-input>
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="16"
          :lg="16"
        >
          <el-form-item
            prop="create"
            class="form-buttons"
          >
            <el-button
              icon="el-icon-circle-plus-outline"
              type="success"
              @click.prevent.stop="guide"
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
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column
          :label="$t('customersView.title')"
          prop="title"
          sortable="custom"
          min-width="150px"
          :class-name="getSortClass()"
        >
          <template slot-scope="{row}">
            <el-tooltip
              :content="$t('customersView.goToTransactions')"
              effect="dark"
              placement="right"
            >
              <span
                class="link-type"
                @click="handleUpdate(row)"
              >{{ row.title }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.authorizedPersonName')"
          min-width="150px"
        >
          <template slot-scope="{row}">
            <span>{{ row.authorized_person_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.phoneNumber')"
          width="150px"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.phone_number }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.debtsAmount')"
          align="center"
          width="100px"
        >
          <template
            slot-scope="{row}"
            text-align="right"
          >
            <span>{{ getPriceText(row.remaining_balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.receivablesAmount')"
          align="center"
          width="100px"
        >
          <template slot-scope="{row}">
            <span>{{ getPriceText(row.remaining_balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.remainingBalance')"
          align="center"
          width="100px"
        >
          <template slot-scope="{row}">
            <span>{{ getPriceText(row.remaining_balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.createdAt')"
          width="150px"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.created_at_text }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('customersView.actions')"
          align="center"
          width="150"
          class-name="fixed-width"
        >
          <template slot-scope="{row, $index}">
            <el-button-group>
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(row)"
              >
                {{ $t('customersView.edit') }}
              </el-button>
              <el-button
                v-if="row.status!=='deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row, $index)"
              >
                {{ $t('customersView.delete') }}
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
        :model="selectedCustomer"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <!-- <el-form-item
          :label="$t('table.type')"
          prop="type"
        >
          <el-select
            v-model="selectedCustomer.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item
          :label="$t('table.date')"
          prop="timestamp"
        >
          <el-date-picker

            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.title')"
          prop="title"
        >
          <el-input v-model="selectedCustomer.title" />
        </el-form-item>
        <!-- <el-form-item :label="$t('table.status')">
          <el-select
            v-model="tempArticleData.status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('table.remark')">
          <el-input
            v-model="selectedCustomer.authorized_person_name"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogFormVisible = false"
        >
          {{ $t('form.cancel') }}
        </el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          @click="editMode?updateData():createData()"
        >
          {{ $t('form.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { defaultCustomer, getCustomers, defaultCustomerQuery } from '@/api/customers/customer-service'
import { ICustomer } from '@/api/customers/types'
import { getPriceText } from '@/utils/index'
import MaterialInput from '@/components/MaterialInput/index.vue'
import { cloneDeep } from 'lodash'
import { Form } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Customer',
  components: {
    MaterialInput,
    Pagination
  }
})
export default class extends Vue {
  private postForm = Object.assign({}, defaultCustomer)
  private query = Object.assign({}, defaultCustomerQuery)

  private tableKey = 0
  private list: ICustomer[] = []
  private total = 0
  private page = 1
  private loading = true
  private selectedCustomer = defaultCustomer
  private editMode = false
  private dialogFormVisible = false
  private rules = {
    // type: [{ required: true, message: 'type is required', trigger: 'change' }],
    // timestamp: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
    title: [{ required: true, message: 'title is required', trigger: 'blur' }]
  }

  private getPriceText = getPriceText

  private sortOptions = [
    { label: 'ID Ascending', key: '+id' },
    { label: 'ID Descending', key: '-id' }
  ]

  private textMap = {
    update: 'Edit',
    create: 'Create'
  }

  created() {
    this.getList()
  }

  private getList() {
    this.loading = true
    this.query.offset = (this.page - 1) * this.query.limit
    this.query.authorized_person_name = this.postForm.authorized_person_name
    this.query.title = this.postForm.title

    getCustomers(this.query)
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

  private handleModifyStatus(row: any, status: string) {
    this.$message({
      message: '操作成功',
      type: 'success'
    })
    row.status = status
  }

  private sortChange(data: any) {
    const { prop, order } = data

    this.query.sort_by = data.prop
    if (prop === 'title') {
      this.sortByTitle(order)
    }
  }

  private sortByTitle(type: string) {
    if (type === 'ascending') {
      this.query.sort_type = 'asc'
    } else {
      this.query.sort_type = 'desc'
    }
    this.handleFilter()
  }

  private getSortClass() {
    const sort = this.query.sort_type
    if (sort === null) {
      return ''
    }
    return sort === 'asc' ? 'ascending' : 'descending'
  }

  private handleUpdate(row: any) {
    this.selectedCustomer = Object.assign({}, row)
    this.editMode = true
    this.dialogFormVisible = true
    console.log(this.dialogFormVisible)
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private handleCreate() {
    this.editMode = false
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private getDialogTitle() {
    return this.editMode ? this.$t('customersView.updateCustomer')
      : this.$t('customersView.createCustomer')
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.list.unshift(this.selectedCustomer)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        this.list.unshift(this.selectedCustomer)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }
}
</script>
