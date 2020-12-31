<template>
  <div class="login">
    <!-- :model="ruleForm" :rules="rules" ref="ruleForm" -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position='top'>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading='isLoginLoading' type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import request from '@/utils/request'
// import qs from 'qs'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '15510792995',
        password: '111111'
      },
      isLoginLoading: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate()

        // 防止登录按钮多次点击
        this.isLoginLoading = true

        // 2. 验证通过 - 提交表单
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //   data: qs.stringify(this.form)
        // })
        const { data } = await login(this.form)
        // console.log(data)
        // 3. 处理请求结构
        // 成功：跳转到首页
        // 失败：给出提示
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 存储登录用户信息
          this.$store.commit('setUser', data.content)
          // 跳转首页
          // this.$router.push({
          //   name: 'home'
          // })

          // 登录成功跳转到首页或者跳转到登录前想去到的页面
          this.$router.push(this.$route.query.redirect as string || '/')

          this.$message.success('登录成功')
        }

        this.isLoginLoading = false
      } catch (error) {
        console.log('格式校验失败', false)
      }
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
