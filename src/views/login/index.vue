<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" label-position='top'>
      <el-form-item label="手机号">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import request from '@/utils/request'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '15510792995',
        password: '111111'
      }
    }
  },
  methods: {
    async onSubmit () {
      // 1. 表单验证
      // 2. 验证通过 - 提交表单
      const { data } = await request({
        method: 'POST',
        url: '/front/user/login',
        data: this.form
      })
      console.log(data)
      // 3. 处理请求结构
      // 成功：跳转到首页
      // 失败：给出提示
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  background-color: $body-bg;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
