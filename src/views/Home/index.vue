<template>
  <div class="home-container">
    <!-- 头部 -->
    <van-nav-bar>
      <template #left >
        <img src="" alt="">
        网络头条
      </template>
      <template #right>
        <!-- <van-icon name="search"  size="0.48rem"/> 不是行内样式就可以转换，单独写样式-->
        <van-icon name="search" @click="$router.push('/search')"/>
      </template>
    </van-nav-bar>
    <!-- tab标签 -->
    <!-- 加了name，这里面的v-model就和name一样，是channelId -->
    <!-- animated加这个属性就没法用 position: fixed-->
    <!-- <van-tabs v-model="active" sticky offset-top="1.23rem" animated> -->
    <van-tabs v-model="active"  >
      <van-tab
      :title="userChannel.name"
      v-for="userChannel in userChannels"
      :key="userChannel.id"
      :name="userChannel.id">

      <ArticleList
      :channelId="active"
      ></ArticleList>
      </van-tab>
      <div slot="nav-right" class="tabRight" @click="showPopup">
        <van-icon name="plus" />
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
      >
      <!-- v-model="active" ，把channelId传下来-->
      <ChannelEdit
      :userChannels="userChannels" :recommendChannels="recommendChannels"
      ref="editRef"
      v-model="active"
      @addChannel="addChannel"
      @removeChannel="removeChannel"
      @close="onClose"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannerls, getAllChannels, updateChannels, removeTheChannel } from '@/api/channels'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 激活时的频道ID，关联着van-tab的name
      userChannels: [], // 用户选择频道列表
      allChannels: [],
      show: false
    }
  },
  created () {
    this.loadUserChannels()
    this.loadAllChannels()
  },
  methods: {
    async loadUserChannels () {
      const { data } = await getUserChannerls()
      console.log('获取用户频道', data)
      this.userChannels = data.data.channels
    },
    async loadAllChannels () {
      const { data } = await getAllChannels()
      console.log('获取所有频道', data)
      this.allChannels = data.data.channels
    },
    showPopup () {
      this.show = true
    },
    // 添加频道，子组件传过来的
    async addChannel (channelObj) {
      this.userChannels.push(channelObj)
      // 把最新的数组发送给我们后台
      // 数组里对象字段 ->转换
      // 推荐频道不能传递-筛选出不是推荐频道的剩下的频道对象
      // 不能直接删除原数组的name，拷贝出一份新数组，修改新数组
      const newArr = this.userChannels.filter(userChannel => userChannel.id !== 0)
      const theNewArr = newArr.map((userChannel, index) => {
        const newObj = { ...userChannel }// 拷贝（浅拷贝）
        // delete对象.属性 可以删除键值对
        delete newObj.name
        newObj.seq = index
        return newObj// 让map方法把新对象收集起来形成一个新数组
      })
      const res = await updateChannels({
        channels: theNewArr
      })
      console.log('更新数组', res)
    },
    async removeChannel (userChannel, i) {
      console.log('删除', userChannel, i)
      // splice删除，每次删一个
      this.userChannels.splice(i, 1)
      const res = await removeTheChannel({
        channelId: userChannel.id
      })
      console.log('删除频道', res)
      // 知道：删除接口返回状态码204（not content）无返回内容
    },
    onClose () {
      this.show = false
      this.$refs.editRef.isEdit = false
    }
  },
  // 计算属性
  computed: {
    // 推荐频道
    recommendChannels () {
      return this.allChannels.filter(allChannel => {
        return !this.userChannels.find(userChannel => {
          return userChannel.id === allChannel.id
        })
      })
    }
  },

  components: {
    ArticleList,
    ChannelEdit
  }
}
</script>

<style lang="less" scoped>
.home-container{
  // padding-top: 46px;
  .van-icon-search{
    color: #fff;
    font-size: 18px;
  }
  /deep/.van-nav-bar__left{
    padding-left: 30px;
    color: #fff;
    font-size: 16px;
  }
  /deep/.van-tabs__wrap{
    margin-right: 40px;
  }
  /deep/.van-tab{
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
  .tabRight{
    position: fixed;
    right: 0;
    width: 40px;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 18px;
    border-bottom: 1px solid #edeff3;
  }
}
</style>
