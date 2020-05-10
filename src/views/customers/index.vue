<template>
  <div class="page-container">
    <el-row>
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row>
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-form
      ref="postForm"
      :model="postForm"
      class="form-container"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            style="margin-bottom: 40px;"
            prop="title"
          >
            <material-input
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
            >
              Title
            </material-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form />
    </el-form>
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
