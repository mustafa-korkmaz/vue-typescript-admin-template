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
          <el-form-item prop="search">
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
      <line-chart :chart-data="lineChartData" />
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

@Component({
  name: 'Customer',
  components: {
    LineChart,
    MaterialInput
  }
})
export default class extends Vue {
  private lineChartData = lineChartData.newVisitis
  private postForm = Object.assign({}, defaultCustomer)
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 1rem;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
