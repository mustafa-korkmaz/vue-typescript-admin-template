<template>
  <el-form>
    <el-form-item :label="$t('profileView.title')">
      <el-input v-model.trim="user.title" />
    </el-form-item>
    <el-form-item :label="$t('profileView.authorizedPersonName')">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input
        v-model.trim="user.email"
        disabled="disabled"
      />
    </el-form-item>
    <el-form-item style="text-align:right">
      <el-button
        type="success"
        icon="el-icon-check"
        @click="submit"
      >
        {{ $t('form.save') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IProfile } from '../index.vue'

@Component({
  name: 'Info'
})
export default class extends Vue {
  @Prop({ required: true }) private user!: IProfile

  private submit() {
    this.$message({
      message: 'User information has been updated successfully',
      type: 'success',
      duration: 5 * 1000
    })
  }
}
</script>
