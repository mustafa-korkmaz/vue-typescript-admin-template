<template>
  <div class="page-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="basicTitle"
        name="basic"
      >
        <el-form
          id="basicImportForm"
          v-loading="loading"
        >
          <el-row>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <el-tooltip
                  effect="dark"
                  placement="right"
                >
                  <div slot="content">
                    {{ $t('dataImportView.basicImportTooltip1') }}
                    <br>{{ $t('dataImportView.basicImportTooltip2') }}
                  </div>
                  <span>{{ $t('dataImportView.basic') }} <i class="el-icon-question" /></span>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <el-button
                  icon="el-icon-download"
                  type="primary"
                  @click="downloadBasicTemplate"
                >
                  {{ $t('dataImportView.downloadTemplate') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <el-button
                  :disabled="importDisabledForBasic"
                  icon="el-icon-refresh"
                  type="success"
                  @click="startBasicImport"
                >
                  {{ $t('dataImportView.startImport') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <span>{{ $t('dataImportView.totalCountToBeImported') }}: {{ basicTableData.length }}</span>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
            >
              <div class="file-upload">
                <upload-excel-component
                  :key="1"
                  :on-success="handleBasicImport"
                  :before-upload="beforeUpload"
                />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              :data="basicTableData"
              border
              highlight-current-row
              style="width: 100%;margin-top:20px;"
            >
              <el-table-column
                v-for="item of basicTableHeader"
                :key="item"
                :prop="item"
                :label="item"
              />
            </el-table>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        :label="detailedTitle"
        name="detailed"
      >
        <el-form
          id="detailedImportForm"
          v-loading="loading"
        >
          <el-row>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <el-tooltip
                  effect="dark"
                  placement="right"
                >
                  <div slot="content">
                    {{ $t('dataImportView.detailedImportTooltip1') }}
                    <br>{{ $t('dataImportView.detailedImportTooltip2') }}
                  </div>
                  <span>{{ $t('dataImportView.detailed') }} <i class="el-icon-question" /></span>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <el-button
                  icon="el-icon-download"
                  type="primary"
                  @click="downloadDetailedTemplate"
                >
                  {{ $t('dataImportView.downloadTemplate') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
            >
              <el-form-item>
                <el-button
                  :disabled="importDisabledForDetailed"
                  icon="el-icon-refresh"
                  type="success"
                  @click="startDetailedImport"
                >
                  {{ $t('dataImportView.startImport') }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
            >
              <div class="file-upload">
                <upload-excel-component
                  :key="2"
                  :on-success="handleDetailedImport"
                  :before-upload="beforeUpload"
                />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              :data="detailedTableData"
              border
              highlight-current-row
              style="width: 100%;margin-top:20px;"
            >
              <el-table-column
                v-for="item of detailedTableHeader"
                :key="item"
                :prop="item"
                :label="item"
              />
            </el-table>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Settings } from '@/layout/components'
import settings from '@/settings'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import * as service from '@/api/data-import/data-import-service'
import { IBasicImportItem, IBasicImportRequest } from '@/api/data-import/types'
import { AppModule } from '@/store/modules/app'
import { defaultCustomer } from '@/api/customers/customer-service'

const { notificationDuration } = settings

interface IImportTracker {
  total: number
  success: number
}

const defaultImportTracker: IImportTracker = {
  total: 0,
  success: 0
}

@Component({
  name: 'DataImport',
  components: {
    UploadExcelComponent,
    Settings
  }
})
export default class extends Vue {
  private loading = false
  private editMode = false
  private dialogFormVisible = false
  private activeName = 'basic'
  private detailedTitle = ''
  private basicTitle = ''
  private detailedTableData: any = []
  private detailedTableHeader: string[] = []
  private basicTableData: any = []
  private basicTableHeader: string[] = []
  private importDisabledForBasic = true
  private importDisabledForDetailed = true
  private importTracker = Object.assign({}, defaultImportTracker)

  created() {
    this.detailedTitle = this.$t('dataImportView.detailedTabTitle').toString()
    this.basicTitle = this.$t('dataImportView.basicTabTitle').toString()
  }

  private beforeUpload(file: File) {
    const isLt1M = file.size / 1024 / 1024 < 5
    if (isLt1M) {
      return true
    }
    this.$message({
      message: this.$t('errorMessages.MaxFileSizeExceeded').toString(),
      type: 'warning'
    })
    return false
  }

  private handleDetailedImport({ results, header }: { results: any, header: string[] }) {
    this.detailedTableData = results
    this.detailedTableHeader = header
    this.importDisabledForDetailed = false
  }

  private handleBasicImport({ results, header }: { results: any, header: string[] }) {
    this.basicTableData = results
    this.basicTableHeader = header
    this.importDisabledForBasic = false
  }

  private downloadBasicTemplate() {
    const name = this.$t('dataImportView.basicTemplateName').toString()
    this.downloadTemplate(name)
  }

  private downloadDetailedTemplate() {
    const name = this.$t('dataImportView.detailedTemplateName').toString()
    this.downloadTemplate(name)
  }

  private downloadTemplate(name: string) {
    service.downloadTemplate(name)
      .then(
        (resp) => {
          this.loading = false
          const fileURL = window.URL.createObjectURL(new Blob([resp]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', name)
          document.body.appendChild(fileLink)

          fileLink.click()
        },
        (err) => {
          console.error(err)
          this.loading = false
        }
      )
  }

  private async startBasicImport() {
    const array: any[] = this.basicTableData
    const imports: IBasicImportItem [] = []

    array.forEach(function(value) {
      const data: IBasicImportItem = {
        receivable_balance: 0,
        debt_balance: 0,
        customer: defaultCustomer
      }

      let authorizedPersonName = ''
      let title = ''
      let phoneNumber = ''

      const keys = Object.keys(value)

      keys.map(function(key, index) {
        switch (index) {
          case 0: {
            title = value[key]
            break
          }
          case 1: {
            authorizedPersonName = value[key]
            break
          }
          case 2: {
            phoneNumber = value[key]
            break
          }
          case 3: {
            data.debt_balance = value[key]
            break
          }
          case 4: {
            data.receivable_balance = value[key]
            break
          }
          default: {
          // statements;
            break
          }
        }
      })

      data.customer = {
        authorized_person_name: authorizedPersonName,
        title: title,
        phone_number: phoneNumber,
        id: null,
        created_at: null,
        remaining_balance: 0,
        receivable_balance: 0,
        debt_balance: 0,
        receivables_amount: 0,
        debts_amount: 0
      }

      imports.push(data)
    })

    this.importTracker = Object.assign({}, defaultImportTracker)
    this.importTracker.total = imports.length

    const validationResult = this.validateImportData()

    if (validationResult !== null) {
      this.$message({
        message: this.$t(validationResult).toString(),
        type: 'warning'
      })
      return
    }

    const chunks = this.splitImportData(imports)
    this.loading = true

    for (let i = 0; i < chunks.length; i++) {
      const request: IBasicImportRequest = {
        language: AppModule.language,
        items: chunks[i]
      }

      try {
        const response = await service.importBasic(request)
        if (response.type === -2) {
          // validation error
          let msg = ''
          const arr = response.error_code.split(' ')
          if (arr.length > 1) {
            const index = response.error_code.indexOf(' ')
            const errorData = response.error_code.substring(index)
            msg = this.$t('errorMessages.' + arr[0], [errorData]).toString()
          } else {
            msg = this.$t('errorMessages.' + arr[0]).toString()
          }
          this.$message({
            message: msg,
            type: 'error'
          })
          break
        }
        this.importTracker.success += response.data
      } catch (err) {
        console.error(err)
        break
      }
    }

    setTimeout(() => {
      this.loading = false
      this.showStatusMessage()
    }, notificationDuration)
  }

  private showStatusMessage() {
    if (this.importTracker.total === this.importTracker.success) {
      const msg = this.$t('dataImportView.importSuccess', [this.importTracker.success])
      this.$notify({
        title: this.$t('messages.success').toString(),
        message: msg.toString(),
        type: 'success',
        duration: notificationDuration
      })
    } else {
      const msg = this.$t('dataImportView.importFail', [this.importTracker.total, this.importTracker.success])
      this.$message({
        message: msg.toString(),
        type: 'error'
      })
    }
  }

  private startDetailedImport() {
    const msg = this.$t('login.comingSoon', [this.importTracker.total, this.importTracker.success])
    this.$message({
      message: msg.toString(),
      type: 'info'
    })
  }

  private validateImportData(): string|null {
    if (this.importTracker.total > 1000) {
      return 'errorMessages.MaxRowCountExceeded'
    }
    return null
  }

  private splitImportData(imports: IBasicImportItem[]): IBasicImportItem[][] {
    let i = 0
    let j = 0
    const chunkSize = 10
    const chunkArray: any = []

    for (i = 0, j = imports.length; i < j; i += chunkSize) {
      const chunk = imports.slice(i, i + chunkSize)
      chunkArray.push(chunk)
    }

    return chunkArray
  }
}
</script>
<style lang="scss" scoped>
.file-upload {
  margin: 0 0 1em 0;
}
</style>
