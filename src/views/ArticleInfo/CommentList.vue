<template>
  <div class="commentList" >
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了，请发表评论"
      @load="onLoad"
    >
      <div class="commentItem" v-for="(obj,i) in commentList" :key="i">
      <van-cell :title="obj.aut_name" :border="false">
        <van-image
        slot="icon"
        round
        :src="obj.aut_photo"
        />
        <!-- 点击的时候，需要把obj对象传下来，不然拿不到里面的数据 -->
        <van-icon
        :name="obj.is_liking ? 'like' : 'like-o'"
        :color="obj.is_liking ? 'red' : 'gray'"
        @click="likeClickFn(obj)"
        />
        <!-- <van-icon name="like" v-if="obj.is_liking === true"/>
        <van-icon name="like-o" v-else/> -->
      </van-cell>
      <van-cell :title="obj.content" >
        <div slot="label" class="reply-w">
          <span>{{formateDate(obj.pubdate)}}</span>
          <van-button type="default" size="mini" round class="reply">{{ obj.reply_count }}回复</van-button>
        </div>
      </van-cell>

      </div>
      <!-- 底部 -->
      <div class="bottom" >
        <van-icon name="arrow-left" @click="$router.back()"/>
        <van-button
        type="default"
        round
        size="small"
        color="#f4f5f6"
        @click="onClickPub"
        >发表评论</van-button>
        <van-icon
        name="comment-o"
        :badge="total_count === 0 ? '' : total_count"
        max="99"
        @click="commentClickFn"
        />
        <van-icon
        :color="articleInfo.is_collected ? 'orange' : '#777'"
        :name="articleInfo.is_collected ? 'star' : 'star-o'"
        @click="artCollectedClick"/>
        <van-icon name="share-o" @click="showShare = true"/>
      </div>
    </van-list>

    <!-- 分享弹出层 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />

     <!-- 底部弹出层 -->
     <van-popup v-model="isShow" position="bottom" >
      <div class="pub-comment">
      <van-field
        v-fofo
        v-model.trim="commText"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
        :border="false"
      ></van-field>
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
      />
     </div>
     </van-popup>
  </div>
</template>

<script>
import { getCommentList, deleteCommentLike, commentLike, pubComment } from '@/api/comment'
import { timeAgo } from '@/utils/day'
import { deleteArtCollection, artCollection } from '@/api/article'
export default {
  name: 'CommentList',
  data () {
    return {
      commentList: [],
      total_count: '', // 评论数量
      commText: '', // 发布评论的内容
      isShow: false, // 弹出层显示
      loading: false, // 下拉加载
      finished: false, // 下拉结束
      offset: null, // 偏移量的ID,分页
      limit: 10,
      showShare: false, // 分享面板
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    }
  },
  props: {
    articleInfo: Object
  },
  created () {

  },
  mounted () {

  },
  methods: {
    formateDate: timeAgo,
    // 评论列表加载更多
    async onLoad () {
      const { data } = await getCommentList({
        source: this.$route.query.art_id,
        offset: this.offset,
        limit: this.limit,
        type: 'a'
      })
      console.log('加载评论列表', data)
      if (data.data.results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
      this.commentList = [...this.commentList, ...data.data.results]
      this.total_count = data.data.total_count
      this.loading = false
    },
    // 得不到is_liking的值，是因为，this指向的是data中的数据，而is_liking是obj，所以需要把这个对象传下来
    // 这里面不能用this.obj.com_id,必须用传下来的，obj不在data中，访问不到
    async likeClickFn (commentObj) {
      if (commentObj.is_liking) {
        const { data } = await deleteCommentLike({ commentId: commentObj.com_id })
        console.log('取消点赞', data)
        commentObj.is_liking = false
      } else {
        const { data } = await commentLike({ commentId: commentObj.com_id })
        console.log('点赞', data)
        commentObj.is_liking = true
      }
    },
    // 发表评论弹出层
    onClickPub () {
      this.isShow = true
    },
    // 把第一条评论滑动到最上面
    commentClickFn () {
      // 只要设置window.scrollTo(0,文章内容高度)
      // js代码是在html+css运行后，真实dom已经在网页上了，从document往下获取标签是可以的
      // const articleHeight = document.querySelector('.article-container').scrollHeight
      // console.log('articleHeight', articleHeight)
      // window.scrollTo(0, articleHeight)
      // window.scrollTo(0, document.querySelector('.article-container').offsetHeight)
      // console.log(document.querySelector('.article-container').offsetHeight)
      // 真实dom都在document,所以不在一个vue文件内，也是可以获取的
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论
    async publishFn () {
      const { data } = await pubComment({
        target: this.$route.query.art_id,
        content: this.commText,
        art_id: null
      })
      console.log('对文章评论', data)
      console.log('this.$route.query', this.$route.query.art_id)
      this.commentList.unshift(data.data.new_obj)
      this.commText = ''
      this.total_count++
      this.isShow = false
      this.commentClickFn()// 把第一条评论滑动到最上面，没成功？？？？？、
    },
    // 收藏
    async artCollectedClick () {
      if (this.articleInfo.is_collected === true) {
        await deleteArtCollection({ art_id: this.$route.query.art_id })
      } else {
        await artCollection({ art_id: this.$route.query.art_id })
      }
      this.$emit('edit-collect', this.articleInfo.is_collected)// 子传父
      this.$toast.success(`${this.articleInfo.is_collected ? '' : '取消'}收藏成功`)
    },
    // 分享
    onSelect (option) {
      this.$toast(option.name)
      this.showShare = false
    }
  }
}
</script>

<style lang="less" scoped>
.commentList{
  margin-bottom:  53px;
}
.bottom{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 52px;
  border-top: 1px solid #f3f4f5;
  background-color: #fff;
  .van-button{
    width: 200px;
    height: 34px;
    color: #333 !important;
    font-size: 14px;
  }
  .van-button__text{
    text-align: left;
  }

}
.van-cell{
  display: flex;
  align-items: center;
}
.van-image{
  width: 40px;
  height: 40px;
  margin-right: 15px;
}
.reply-w{
  display: flex;
  align-items: center;
  .reply{
    width: 80px;
    margin-left: 15px;
  }
}
.pub-comment{
  display: flex;
  align-items: center;
  padding: 16px 0 16px 16px;
}
.van-field{
  background-color:#f5f7f9 ;
}
.pub-btn{
  width: 75px;
  border: none;
  padding: 0;
  color: #6ba3d8;
  }
</style>
