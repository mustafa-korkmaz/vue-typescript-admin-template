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
              v-model="postForm.title"
              :maxlength="100"
              name="title"
              required
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
              v-model="postForm.authorized_person_name"
              :maxlength="100"
              name="authorized_person_name"
              required
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
              @click.prevent.stop="guide"
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
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column
          :label="$t('table.id')"
          prop="id"
          sortable="custom"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.date')"
          width="180px"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.title')"
          min-width="150px"
        >
          <template slot-scope="{row}">
            <span
              class="link-type"
              @click="handleUpdate(row)"
            >{{ row.title }}</span>
            <el-tag>{{ row.type | typeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.author')"
          width="180px"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="showReviewer"
          :label="$t('table.reviewer')"
          width="110px"
          align="center"
        >
          <template slot-scope="{row}">
            <span style="color:red;">{{ row.reviewer }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.importance')"
          width="105px"
        >
          <template slot-scope="{row}">
            <svg-icon
              v-for="n in +row.importance"
              :key="n"
              name="star"
              class="meta-item__icon"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.readings')"
          align="center"
          width="95"
        >
          <template slot-scope="{row}">
            <span
              v-if="row.pageviews"
              class="link-type"
              @click="handleGetPageviews(row.pageviews)"
            >{{ row.pageviews }}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.status')"
          class-name="status-col"
          width="100"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status | articleStatusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="230"
          class-name="fixed-width"
        >
          <template slot-scope="{row, $index}">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(row)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              v-if="row.status!=='published'"
              size="mini"
              type="success"
              @click="handleModifyStatus(row,'published')"
            >
              {{ $t('table.publish') }}
            </el-button>
            <el-button
              v-if="row.status!=='draft'"
              size="mini"
              @click="handleModifyStatus(row,'draft')"
            >
              {{ $t('table.draft') }}
            </el-button>
            <el-button
              v-if="row.status!=='deleted'"
              size="mini"
              type="danger"
              @click="handleDelete(row, $index)"
            >
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-row>
    <el-row>
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LineChart from './components/LineChart.vue'
import { defaultCustomer } from '@/api/customers/customer-service'
import MaterialInput from '@/components/MaterialInput/index.vue'
import { getArticles, defaultArticleData } from '@/api/articles'
import { IArticleData } from '@/api/types'
import { cloneDeep } from 'lodash'
import { Form } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

const calendarTypeOptions = [
  { key: 'CN', displayName: 'China' },
  { key: 'US', displayName: 'USA' },
  { key: 'JP', displayName: 'Japan' },
  { key: 'EU', displayName: 'Eurozone' }
]

@Component({
  name: 'Customer',
  components: {
    LineChart,
    MaterialInput,
    Pagination
  }
})
export default class extends Vue {
  private lineChartData = lineChartData.newVisitis
  private postForm = Object.assign({}, defaultCustomer)
  private tableKey = 0
  private list: IArticleData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    importance: undefined,
    title: undefined,
    type: undefined,
    sort: '+id'
  }

  private downloadLoading = false
  private tempArticleData = defaultArticleData

  private importanceOptions = [1, 2, 3]
  private calendarTypeOptions = calendarTypeOptions
  private sortOptions = [
    { label: 'ID Ascending', key: '+id' },
    { label: 'ID Descending', key: '-id' }
  ]

  private statusOptions = ['published', 'draft', 'deleted']
  private showReviewer = false
  private dialogFormVisible = false
  private dialogStatus = ''
  private textMap = {
    update: 'Edit',
    create: 'Create'
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getArticles(this.listQuery)
    this.list = data.items
    this.total = data.total
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleFilter() {
    this.listQuery.page = 1
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
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }

  private getSortClass(key: string) {
    const sort = this.listQuery.sort
    return sort === `+${key}` ? 'ascending' : 'descending'
  }

  private resetTempArticleData() {
    this.tempArticleData = cloneDeep(defaultArticleData)
  }

  private handleCreate() {
    this.resetTempArticleData()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }
}
</script>
