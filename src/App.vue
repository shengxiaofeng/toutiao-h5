<template>
  <div >
    <!--exclude不需要缓存的一级路由页面，这个名字就是组件的名字  -->
    <keep-alive exclude="SearchIndex,SearchResult,ArticleInfo,EditUserPro">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>

export default {

}
</script>

<style lang="less" scoped>

</style>
