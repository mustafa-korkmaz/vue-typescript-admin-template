<template>
  <div>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept="*"
      @change="handleClick"
    >
    <div
      class="drop"
      :class="{hover: isHovering}"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
      @dragleave="handleDragleave"
    >
      {{ dropZoneText }}
      <el-button
        :loading="loading"
        style="margin-left:16px;"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        {{ browseButtonText }}
      </el-button>
      <el-button
        v-if="showDeleteButton"
        style="margin-left:16px;"
        size="mini"
        type="danger"
        @click="handleClear"
      >
        {{ $t('form.delete') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'FileUpload'
})
export default class extends Vue {
  @Prop({ required: true }) private beforeUpload!: Function
  @Prop({ required: true }) private onSuccess!: Function
  @Prop({ required: true }) private existingFileName!: string

  private loading = false
  private dropZoneText = ''
  private browseButtonText = ''
  private isHovering = false
  private showDeleteButton = false

  created() {
    const attachmentExists = this.existingFileName !== null

    if (attachmentExists) {
      this.dropZoneText = this.existingFileName
      this.browseButtonText = this.$t('transactionsView.browseAnother').toString()
      this.showDeleteButton = true
    } else {
      this.dropZoneText = this.$t('transactionsView.fileUploadDescription').toString()
      this.browseButtonText = this.$t('transactionsView.browse').toString()
    }
  }

  private handleDrop(e: DragEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.loading) return
    if (!e.dataTransfer) return
    const files = e.dataTransfer.files
    if (files.length !== 1) {
      this.$message.error(this.$t('transactionsView.fileAmountExceeded').toString())

      return
    }
    const rawFile = files[0] // only use files[0]

    this.upload(rawFile)
    e.stopPropagation()
    e.preventDefault()

    this.isHovering = false
  }

  private handleDragover(e: DragEvent) {
    e.stopPropagation()
    e.preventDefault()
    this.isHovering = true
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  private handleDragleave(e: DragEvent) {
    e.stopPropagation()
    e.preventDefault()
    this.isHovering = false
  }

  private handleUpload() {
    (this.$refs['excel-upload-input'] as HTMLInputElement).click()
  }

  private handleClick(e: MouseEvent) {
    const files = (e.target as HTMLInputElement).files
    if (files) {
      const rawFile = files[0] // only use files[0]
      this.upload(rawFile)
    }
  }

  private upload(rawFile: File) {
    (this.$refs['excel-upload-input'] as HTMLInputElement).value = '' // Fixes can't select the same excel
    if (!this.beforeUpload) {
      this.readerData(rawFile)
      return
    }
    const before = this.beforeUpload(rawFile)
    if (before) {
      this.readerData(rawFile)
    }
  }

  private readerData(rawFile: File) {
    this.loading = true
    const reader = new FileReader()
    reader.onload = e => {
      this.loading = false
      this.dropZoneText = rawFile.name
      this.browseButtonText = this.$t('transactionsView.browseAnother').toString()
      this.showDeleteButton = true
      this.onSuccess(rawFile.name, rawFile)
    }
    reader.readAsArrayBuffer(rawFile)
  }

  private handleClear() {
    this.showDeleteButton = false
    this.dropZoneText = this.$t('transactionsView.fileUploadDescription').toString()
    this.browseButtonText = this.$t('transactionsView.browse').toString()

    this.onSuccess('_deleted', null)
  }
}
</script>
<style lang="scss" scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 100%;
  height: 50%;
  line-height: 6em;
  margin: 0 auto;
  font-size: 1rem;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.drop.hover {
  opacity: 50%;
}
</style>
