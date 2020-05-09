<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div>
      <svg-icon
        name="language"
        class="international-icon"
      />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="language==='tr'"
        command="tr"
      >
        Türkçe
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='en'"
        command="en"
      >
        English
      </el-dropdown-item>
      <!-- <el-dropdown-item
        :disabled="language==='es'"
        command="es"
      >
        Español
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='ja'"
        command="ja"
      >
        日本語
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='ko'"
        command="ko"
      >
        한국어
      </el-dropdown-item> -->
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'LangSelect'
})
export default class extends Vue {
  get language() {
    return AppModule.language
  }

  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang
    AppModule.SetLanguage(lang)

    const msg = this.$t('messages.languageModified')

    this.$message({
      message: msg.toString(),
      type: 'success'
    })
  }
}
</script>
