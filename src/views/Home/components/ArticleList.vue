<template>
  <div class="articleList">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      offset="50"
      @load="onLoad"
    >
    <ArticleItem
    v-for="obj in articleList"
    :key="obj.art_id"
    :artitem="obj"
    @click.native="itemClick(obj.art_id)"
    ></ArticleItem>
    </van-list>
  </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem.vue'
import { getAllArticles } from '@/api/article'

export default {
  name: 'ArticleList',
  data () {
    return {
      articleList: [],
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      theTime: new Date().getTime(), // 用于分页,当前时间戳
      isLoading: false
    }
  },
  props: {
    channelId: Number
  },
  created () {
    this.loadAllArticles()
    console.log('111')
  },
  methods: {
    // 专门负责发送请求
    async loadAllArticles () {
      const { data } = await getAllArticles({
        channel_id: this.channelId, // 默认请求推荐频道的数据
        // timestamp: (new Date()).getTime()
        timestamp: this.theTime
      })
      console.log('获取所有文章', data)
      this.articleList = [...this.articleList, ...data.data.results]
      this.theTime = data.data.pre_timestamp
      this.loading = false
      if (data.data.pre_timestamp === null) {
        // 本次回来的数据是最后，没有下一段数据了
        this.finished = true
      }
      this.isLoading = false// 顶部加载状态改为false
    },
    // 上拉刷新
    async onLoad () {
      console.log('222')
      if (this.articleList.length === 0) {
        this.loading = false
        return// 如果页面没有数据，没有高度，让本次onload 逻辑代码不往下执行
      }
      this.loadAllArticles()// 调方法属于异步操作，有可能数据还没回来
    },
    // 下拉加载
    async onRefresh () {
      console.log('333')
      this.articleList = []
      this.theTime = new Date().getTime()
      this.loadAllArticles()
    },
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
.articleList{
  position: fixed;
  top:97px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
</style>
