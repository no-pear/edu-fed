<template>
  <div>
      <h2>布局</h2>

      <!-- 子路由出口 -->
      <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutIndex'
})
</script>

<style>

</style>
