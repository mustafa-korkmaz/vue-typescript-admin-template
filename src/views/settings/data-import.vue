<template>
  <div class="page-container">
    <el-form
      ref="postForm"
      v-loading="loading"
      class="form-container"
    >
      <el-row>
        <el-col :span="16">
          <span>{{ $t('route.dataImport') }}</span>
        </el-col>
        <el-col :span="16">
          <el-form-item
            prop="create"
            class="form-buttons"
          >
            <el-button
              icon="el-icon-check"
              type="primary"
              @click="updateSettings"
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
import { updateSettings } from '@/api/user/account-service'
import MaterialInput from '@/components/MaterialInput/index.vue'
import { Settings } from '@/layout/components'
import { SettingsModule } from '@/store/modules/settings'
import { IUserSettings } from '../../api/user/types'
import settings from '@/settings'

const { notificationDuration } = settings

@Component({
  name: 'DataImport',
  components: {
    MaterialInput,
    Settings
  }
})
export default class extends Vue {
  private loading = false
  private editMode = false
  private dialogFormVisible = false

  private updateSettings() {
    this.loading = true

    const settings: IUserSettings = {
      fixed_header: SettingsModule.fixedHeader,
      open_tags_view: SettingsModule.showTagsView,
      theme_color: SettingsModule.theme,
      pagination_align: SettingsModule.paginationAlign
    }
    updateSettings(settings)
      .then(
        () => {
          this.loading = false
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
}
</script>
