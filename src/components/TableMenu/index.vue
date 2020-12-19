<template>
  <el-row
    :gutter="5"
    style="margin-bottom:0;padding-top:0"
  >
    <el-col :span="23">
      <el-select
        v-if="columnSelectionOptionActivated"
        v-model="selectedOptionalColumns"
        multiple
        collapse-tags
        class="column-selection"
        :placeholder="$t('table.selectColumns')"
        @change="optionalColumnsChanged"
      >
        <el-option
          v-for="item in columnSelectionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-col>
    <el-col
      :span="1"
      style="float:right;width:0"
    >
      <el-dropdown
        trigger="click"
        @command="handleSelection"
      >
        <div>
          <el-tooltip
            placement="left"
            class="table-menu"
            :content="$t('table.menu')"
          >
            <div>
              <i class="el-icon-more icon" />
            </div>
          </el-tooltip>
          <!-- <i class="el-icon-more icon" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="excel"
            icon="el-icon-download"
          >
            {{ $t('table.exportToExcel') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-if="activateColumnSelectionOption"
            divided
            :icon="columnSelectionOptionActivated ? 'el-icon-remove-outline':'el-icon-circle-plus-outline'"
            command="toggle-select-columns"
          >
            {{ toggleColumnSelectionText }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface IOption {
  value: any
  label: string
}

@Component({
  name: 'TableMenu'
})
export default class extends Vue {
  @Prop({ default: false }) private activateColumnSelectionOption!: boolean
  @Prop({ default: [] }) private columnSelectionOptions!: IOption[]

  private columnSelectionOptionActivated = false
  private selectedOptionalColumns: string[] = []

  get toggleColumnSelectionText() {
    if (this.columnSelectionOptionActivated) {
      return this.$t('table.hideColumnSelectionOptions').toString()
    }
    return this.$t('table.showColumnSelectionOptions').toString()
  }

  private handleSelection(cmd: string) {
    switch (cmd) {
      case 'excel':
        // handle excel
        this.excelExportClicked()
        break
      case 'toggle-select-columns':
        // handle column selection
        this.columnSelectionOptionActivated = !this.columnSelectionOptionActivated
        break
    }
  }

  private optionalColumnsChanged() {
    this.$emit('optionalColumnsChanged', this.selectedOptionalColumns)
  }

  private excelExportClicked() {
    this.$emit('excelExportClicked')
  }
}
</script>

<style scoped>
.el-icon-more.icon {
  cursor: pointer;
  transform: rotate(90deg);
  color: #5a5e66;
  float: right;
}

.column-selection {
  width: 20%;
  float: right;
}
</style>
