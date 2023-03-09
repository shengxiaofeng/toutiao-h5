<template>
  <div class="login-container">
    <van-nav-bar
      title="登录"
    />

    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        required
        name="mobile"
        label="手机号"
        placeholder="请输入11位手机号"
        :rules="[{ required: true, message: '请填写手机号',pattern:/^1[3-9]\d{9}$/}]"
      />
      <van-field
        v-model="user.code"
        required
        type="password"
        name="code"
        label="密码"
        placeholder="请输入6位密码"
        :rules="[{ required: true, message: '请填写密码' ,
      pattern:/^\d{6}$/}]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :loading="isLoading" loading-text="正在登录中......" :disabled="isLoading">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storage'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      this.isLoading = true
      console.log('submit', values)
      try {
        // 第一种
        const { data } = await login(this.user)
        // const res = await login({
        //   // 第二种
        //   // mobile: this.user.mobile,
        //   // code: this.user.code
        //   // 第三种
        //   // ...this.user
        // })
        console.log('登录', data)
        this.$toast.success('登录成功')
        setToken(data.data.token)
        // 存refresh_token
        setStorage('refresh_token', data.data.refresh_token)
        // 跳转一定要写在最后，尽量最后执行
        this.$router.replace({ path: this.$route.query.path || '/home' })
      } catch (error) {
        console.log('error', error)
        this.$toast.fail(error.response.data.message)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
