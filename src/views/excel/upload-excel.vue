<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-table
      v-loading="loading"
      fit
      highlight-current-row
      style="width: 100%;"
      :data="tableData"
      @sort-change="sortChange"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
        min-width="10"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

@Component({
  name: 'UploadExcel',
  components: {
    UploadExcelComponent
  }
})
export default class extends Vue {
  private tableData: any = []
  private tableHeader: string[] = []

  private beforeUpload(file: File) {
    const isLt1M = file.size / 1024 / 1024 < 1
    if (isLt1M) {
      return true
    }
    this.$message({
      message: 'Please do not upload files larger than 1m in size.',
      type: 'warning'
    })
    return false
  }

  private handleSuccess({ results, header }: { results: any, header: string[]}) {
    this.tableData = results
    this.tableHeader = header
  }
}
</script>
