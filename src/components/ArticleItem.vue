<template>
  <div class="articleItem">
      <van-cell>
        <template #title>{{ artitem.title }}</template>

        <template #label>
          <div  v-if="artitem.cover.type === 3">
            <van-image v-for="(img,i) in artitem.cover.images" :key="i"
              :src="img"></van-image>
          </div>
          <div>
            <span>{{artitem.aut_name}}</span>
            <span>{{artitem.comm_count}}条评论</span>
            <span>{{formatTime(artitem.pubdate)}}</span>
          </div>

        </template>

        <template #extra v-if="artitem.cover.type === 1" >
          <van-image class="img1"
            :src="artitem.cover.images[0]"
          />
        </template>

      </van-cell>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/day'

export default {
  name: 'ArticleItem',
  data () {
    return {

    }
  },
  props: {
    artitem: Object
    // artitem: {
    //   required: true,
    //   type: Object
    // }
  },
  methods: {
    formatTime: timeAgo // 函数体是timeAgo
  }

}
</script>

<style lang="less" scoped>
.articleItem{
  .van-cell{
    span{
      margin-right: 10px;
    }
  }
  .van-image{
    width: 110px;
    height: 73px;
    margin-right: 4px;
    object-fit: cover;
  }
  .img1{
    margin-left:30px;
  }
}

</style>
