<template>
  <div class="page-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="basicTitle"
        name="basic"
      >
        <el-form id="basicImportForm">
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
        <el-form id="detailedImportForm">
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
      message: 'Please do not upload files larger than 5m in size.',
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

  private startBasicImport() {
    const array: any[] = this.basicTableData
    const imports: IBasicImportItem [] = []

    array.forEach(function(value) {
      const data: IBasicImportItem = {
        receivable_balance: 0,
        debt_balance: 0,
        customer: defaultCustomer
      }

      let authorized_person_name = ''
      let title = ''
      let phone_number = ''

      const keys = Object.keys(value)

      keys.map(function(key, index) {
        switch (index) {
          case 0: {
            title = value[key]
            break
          }
          case 1: {
            authorized_person_name = value[key]
            break
          }
          case 2: {
            phone_number = value[key]
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
        authorized_person_name: authorized_person_name,
        title: title,
        phone_number: phone_number,
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

    const request: IBasicImportRequest = {
      language: AppModule.language,
      items: imports
    }
    service.importBasic(request)
      .then(
        (resp) => {
          this.loading = false
        },
        (err) => {
          console.error(err)
          this.loading = false
        }
      )
  }

  private startDetailedImport() {
    alert('startDetaileImport')
  }
}
</script>
<style lang="scss" scoped>
.file-upload {
  margin: 0 0 1em 0;
}
</style>
