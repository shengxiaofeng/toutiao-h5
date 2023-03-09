<template>
  <div class="layout-container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0

    }
  }
}
</script>

<style lang="less" scoped>
.layout-container{
  padding-bottom: 46px;
}
.van-tabbar{
  border-top: 1px solid #f8f8f8;
}
</style>
