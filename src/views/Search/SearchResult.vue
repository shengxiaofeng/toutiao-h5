<template>
  <div class="searchResult">

    <van-nav-bar
      title="搜索结果"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <!-- 一上来不要触底 :immediate-check="false" -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="onLoad"
    >
    <!-- 数组复用，需要传一个对象  :artitem="obj"-->
    <ArticleItem
      v-for="(obj,i) in searchResult"
      :key="i"
      :artitem="obj"
      @click.native="itemClick(obj.art_id)"
    ></ArticleItem>
  </van-list>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem.vue'
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      searchResult: [],
      loading: false,
      finished: false
    }
  },
  created () {
    this.loadSearch()
  },
  methods: {
    async loadSearch () {
      const { data } = await getSearch({
        page: this.page,
        q: this.$route.params.kw
      })
      console.log('搜索结果', data)
      console.log('this.$route', this.$route)
      if (data.data.results.length === 0) {
        // 没有更多数据
        this.finished = true
        return
      }
      // this.searchResult = data.data.results
      this.searchResult = [...this.searchResult, ...data.data.results]
      this.loading = false
    },
    async onLoad () {
      if (this.searchResult.length > 0) {
        this.page++
        this.loadSearch()
      }
    },
    // 跳转到详情
    itemClick (id) {
      this.$router.push({
        path: `/articleInfo?art_id=${id}`
      })
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style lang="less" scoped>
.searchResult{
  padding-top: 46px;
}
/deep/.van-nav-bar .van-icon {
  margin-right: 10px;
  font-size: 16px;
  color: #fff;
}

</style>
