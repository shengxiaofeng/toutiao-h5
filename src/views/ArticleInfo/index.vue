<template>
  <div class="articleInfo">
    <van-nav-bar
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 文章信息区 -->
  <div class="article-container">
    <h1>{{articleInfo.title}}</h1>
    <van-cell :title="articleInfo.aut_name" :label="formatDate(articleInfo.pubdate)" class="header" :border="false">
      <van-image
        slot="icon"
        round
        :src="articleInfo.aut_photo"
      />
      <van-button type="info" size="mini" v-if="articleInfo.is_followed" @click="followedFn(true)">已关注</van-button>
      <van-button plain type="info" icon="plus" size="mini" v-else @click="followedFn(false)">关注</van-button>
    </van-cell>

    <div class="content markdown-body" v-html="articleInfo.content" ></div>
    <div class="good-job">

      <van-button plain type="danger" :icon="articleInfo.attitude === 1 ? 'good-job' : 'good-job-o'" size="small" @click="loveFn" class="like-box">点赞</van-button>
    </div>
  </div>

  <!-- 文章评论区 -->
  <div>
    <CommentList
    :articleInfo="articleInfo"
    @edit-collect="editCollect"
    ></CommentList>
  </div>

  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleInfo, deleteArticleLove, articleLove } from '@/api/article'
import { timeAgo } from '@/utils/day.js'
import { deleteUserFollow, userFollow } from '@/api/user'
import CommentList from './CommentList.vue'

export default {
  name: 'ArticleInfo',
  data () {
    return {
      articleInfo: {},
      is_followed: false
    }
  },
  created () {
    this.loadArticleInfo()
  },
  methods: {
    formatDate: timeAgo, // 不能直接使用timeAgo
    async loadArticleInfo () {
      const { data } = await getArticleInfo({
        article_id: this.$route.query.art_id
      })
      console.log('获取文章详情', data)
      this.articleInfo = data.data
    },
    // 关注/取关
    async followedFn (bool) {
      if (bool === true) {
        // 取关
        await deleteUserFollow({ aut_id: this.articleInfo.aut_id })
        this.articleInfo.is_followed = false
      } else {
        await userFollow({ aut_id: this.articleInfo.aut_id })
        this.articleInfo.is_followed = true
      }
    },

    onClickPublish () {
      this.isShow = true
    },
    // 点赞
    async loveFn () {
      if (this.articleInfo.attitude === 1) {
        await deleteArticleLove({ art_id: this.articleInfo.art_id })
        this.articleInfo.attitude = -1
      } else {
        await articleLove({ art_id: this.articleInfo.art_id })
        this.articleInfo.attitude = 1
      }
    },
    // 收藏
    editCollect () {
      this.articleInfo.is_collected = !this.articleInfo.is_collected
    }
  },
  components: {
    CommentList
  }
}
</script>

<style lang="less" scoped>
.articleInfo{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
}
.articleInfo{
  margin-top: 46px;
  h1{
    font-size: 20px;
    color: #3a3a3a;
    padding: 15px;
    margin: 0;

  }
}
/deep/.van-nav-bar .van-icon {
  margin-right: 10px;
  font-size: 16px;
  color: #fff;
}
.van-image{
  width: 40px;
  height: 40px;
  margin-right: 15px;
}
.header{
  display: flex;
  align-items: center;
}
.content{
  padding: 15px;
  font-size: 14px;
}
.good-job{
  text-align: center;
}
</style>
