<template>
  <div class="my-container">
    <div class="user-card">
      <van-cell :title="user.name" :border="false">
        <van-image
          class="ava"
          slot="icon"
          fit="cover"
          round
          :src="user.photo"
        />
        <van-button
        type="default"
        slot="label"
        size="mini"
        >申请认证</van-button>
      </van-cell>
      <van-grid :column-num="3" :border="false" class="data-info">
        <van-grid-item text="动态" >
          <div slot="icon">{{user.art_count}}</div>
        </van-grid-item>
        <van-grid-item text="关注" >
          <div slot="icon">{{user.follow_count}}</div>
        </van-grid-item>
        <van-grid-item text="粉丝" >
          <div slot="icon">{{user.fans_count}}</div>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="info">
      <van-cell title="编辑资料" is-link  icon="edit" :border="false" to="/userPro"/>
      <van-cell title="退出登录" is-link  icon="warning-o" :border="false" @click="onLogout"/>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/api/user'
import { removeToken } from '@/utils/token'

export default {
  name: 'MyIndex',
  data () {
    return {
      user: {}
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUser()
      console.log('获取用户个人资料', data)
      this.user = data.data
    },
    onLogout () {
      this.$dialog.confirm({
        title: '确认退出吗'
      })
        .then(() => {
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container{
  .user-card{
    height: 200px;
    background-color: #007bff;
    .van-cell{
    background-color: unset;
    color: #fff;
    font-size: 16px;
    padding: 35px 20px 11px;
    }
    /deep/.van-grid-item__content{
      background-color: unset;
    }
    .data-info{
      color: #fff;
      font-size: 18px;
      /deep/.van-grid-item__text{
      color: #fff;
      font-size: 14px;
      margin-top: 6px;
      }
    }
  }
  .info{
    .van-cell{
      padding: 15px 20px;
      font-size: 15px;
    }
  }
  .ava{
    width: 66px;
    height: 66px;
    border: 1px solid #fff;
    margin-right: 10px;
  }
  .van-button__text{
      color: #007bff;
  }

}
</style>
