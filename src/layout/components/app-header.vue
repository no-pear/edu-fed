<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :size="35" :src=" userInfo.portrait||circleUrl"></el-avatar>
        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserInfo } from '@/services/user'

export default Vue.extend({
  name: 'AppHeader',
  data () {
    return {
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      userInfo: {} // 当前登录用户信息
    }
  },
  methods: {
    // 获取用户信息
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        // console.log('getUserInfo', data)
        this.userInfo = data.content
      } catch (error) {
      }
    },
    // 退出登录
    handleLogout () {
      // console.log('exit')
      this.$confirm('确认退出登录?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除登录状态
        this.$store.commit('setUser', null)
        // 跳转登录页
        this.$router.push({
          path: '/login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  },
  created () {
    this.loadUserInfo()
    this.loadUserInfo()
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
