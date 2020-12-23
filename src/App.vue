<template>
  <div id="app">
    <h1 class="hello">hello world</h1>
    <!-- 跟路由出口 -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>

<style lang="scss" scoped>
// @import '~@/styles/variables.scss';

.hello {
  color: $danger-color;
}
</style>
