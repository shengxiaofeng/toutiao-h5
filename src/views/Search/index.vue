<template>
  <div class="search-container">
    <!-- v-fofo自动聚焦 -->
    <van-search
      v-model.trim="kw"
      shape="round"
      background="#007bff"
      placeholder="请输入搜索关键词"
      v-fofo
      @input="onInput"
      @search="onSearch"
      >
      <template #left>
        <van-icon name="arrow-left" color="#fff" @click="$router.back()"/>
      </template>
    </van-search>

    <!-- 搜索建议列表 -->
    <div v-if="kw.length !== 0">
      <van-cell v-for="(suggest,i) in suggestList" :key="i"  @click="suggestClick(suggest)">
        <div slot="title"  v-html="highLight(suggest,kw)"></div>
      </van-cell>
    </div>

    <!-- 搜索历史 -->
    <div v-else>
      <van-cell title="搜索历史">
        <template #right-icon>
          <van-icon name="delete" @click="deleteFn"/>
        </template>
      </van-cell>
      <van-cell :title="str" v-for="(str,i) in history" :key="i" @click="histroyClick(str)"/>
    </div>

  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'

export default {
  name: 'SearchIndex',
  data () {
    return {
      kw: '',
      timer: null, // 防抖的定时器
      suggestList: [], // 联想建议
      history: JSON.parse(localStorage.getItem('his')) || []// 搜索历史
    }
  },
  methods: {
    // 输入框内容实时改变触发事件方法
    onInput () {
      // 防抖:延时执行逻辑代码，事件再次触发时，清除上一个定时器
      clearTimeout(this.timer)
      // 如果搜索字删除，数组清空
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return
          console.log(this.kw)
          const { data } = await getSuggestion({
            kw: this.kw
          })
          console.log('搜索建议', data)
          this.suggestList = data.data.options
        }, 300)
      }
    },
    // 专门处理字符串高亮关键字
    highLight (originStr, target) {
      // originStr:原来的字符串
      // target:关键字
      // 字符串.replace()
      // 返回值：替换后的完整字符串
      // 如果要使用变量，作为正则的匹配条件，不能用语法糖简化写法
      // match是原来本身的字符，不会改变大小写
      const reg = new RegExp(target, 'ig')
      return originStr.replace(reg, (match) => {
        return `<span style="color: red">${match}</span>`
      })
    },
    // 封装跳转

    moveFn (theKw) {
      // 坑：路由跳转，在watch之前执行，所以我们要让路由跳转，来一个定时器包裹，让跳转最后执行
      setTimeout(() => {
        this.$router.push({
          path: `/searchResult/${theKw}`
        })
      })
    },
    // 点击搜索事件
    onSearch () {
      if (this.kw.length > 0) {
        this.moveFn(this.kw)
        // this.$router.push({
        //   path: `/searchResult/${this.kw}`
        // })
        this.history.push(this.kw)
      }
    },
    // 联想菜单点击事件
    suggestClick (suggest) {
      this.moveFn(suggest)
      // this.$router.push({
      //   path: `/searchResult/${suggest}`
      // })
      this.history.push(suggest)
    },
    // 搜索历史点击事件
    histroyClick (str) {
      // this.$router.push({
      //   path: `/searchResult/${str}`
      // })
      this.moveFn(str)
    },
    deleteFn () {
      this.history = []
    }
  },
  // 侦听器使用
  watch: {
    history: {
      // 历史记录数组的改变
      deep: true,
      handler () {
        // ES6新增了2种引用类型（以前Array，Object），新增Set,Map
        // Set：无序不重复的value集合体（无下角标）
        // 特点：你传入的数组类型，如果有重复元素，会自动清理掉重复元素，返回无重复的Set对象
        const theSet = new Set(this.history)
        // set类型对象 ->转回 -> Array数组类型
        const arr = Array.from(theSet)
        // 立刻覆盖式的保存到本地
        localStorage.setItem('his', JSON.stringify(arr))
      }

    }
  }

}
</script>

<style lang="less" scoped>
.van-icon-arrow-left{
  margin-right: 10px;
  font-size: 16px;
}
</style>
