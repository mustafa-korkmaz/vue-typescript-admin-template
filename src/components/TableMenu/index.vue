<template>
  <div>
    <el-dropdown
      trigger="click"
      class="table-menu"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'TableMenu'
})
export default class extends Vue {
  @Prop({ default: false }) private activateColumnSelectionOption!: boolean

  private columnSelectionOptionActivated = false

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
        break
      case 'toggle-select-columns':
        // handle column selection
        this.columnSelectionOptionActivated = !this.columnSelectionOptionActivated
        this.$emit('toggleColumnSelection', this.columnSelectionOptionActivated)
        break
    }

    this.$message({
      message: cmd,
      type: 'success'
    })
  }
}
</script>

<style scoped>
.table-menu {
  float: right;
}

.el-icon-more.icon {
  cursor: pointer;
  transform: rotate(90deg);
  color: #5a5e66;
}
</style>
