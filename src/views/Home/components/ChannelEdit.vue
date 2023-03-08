<template>
  <div class="channelEdit">

    <van-cell title="我的频道" :border="false">
      <van-button
      plain
      type="danger"
      size="mini"
      round
      @click="isEdit=!isEdit">
      {{isEdit ? '完成' :'编辑'}}
    </van-button>
    </van-cell>

    <van-grid :gutter="10" :border="false">
      <van-grid-item
      v-for="(userChannel,i) in userChannels"
      :key="i"
      :text="userChannel.name"
      :icon="isEdit && i !== 0 ? 'clear' : ''"
      center
      @click="userChannelClick(userChannel,i)"/>
    </van-grid>

    <van-cell title="频道推荐" :border="false"></van-cell>

    <van-grid :gutter="10">
      <van-grid-item v-for="(recommendChannel,i) in recommendChannels" :key="i"  :text="recommendChannel.name" @click="moreChannels(recommendChannel)"/>
    </van-grid>

  </div>
</template>

<script>

export default {
  name: 'ChannelEdit',
  data () {
    return {
      isEdit: false
    }
  },
  props: {
    userChannels: Array,
    recommendChannels: Array
  },
  created () {
  },
  methods: {
    // 点击推荐频道,要把对象传过来，不能传ID，
    moreChannels (channelObj) {
      console.log('22', channelObj)
      if (this.isEdit === true) {
        // this.userChannels.push(channelObj)//userChannels为props不能直接修改
        this.$emit('addChannel', channelObj)
      }
    },
    userChannelClick (userChannel, i) {
      if (this.isEdit === true) {
        // 推荐频道不能删除，但是不能和上面的写在一起，如果写在一起不符合，推荐直接就变成进入频道了，所以外面if ，再进来判断
        if (i !== 0) {
          this.$emit('removeChannel', userChannel, i)
        }
      } else {
        // 切换频道
        // 触发v-model 绑定input事件
        // 把值传出去绑定给v-model对应的vue变量
        this.$emit('input', userChannel.id)
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channelEdit{
  margin-top: 50px;
}
.van-button--danger{
  padding: 0 12px;
  font-size: 14px;
}
.van-grid-item{
  position: relative;
}
/deep/.van-icon-clear{
  position: absolute;
  right: 5px;
  top: -5px;
  font-size: 20px;
  color: #ccc;
}
/deep/.van-grid-item__content{
  background-color: #f4f5f6;
  border-radius: 3px;
  width: 80px;
  height: 43px;
}
/deep/.van-grid-item__text{
  font-size: 14px;
  color: #222;
  margin-top: 0;
}
</style>
