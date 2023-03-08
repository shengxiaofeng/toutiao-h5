<template>
  <div class="editUserBir">
    <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="$emit('close')"
        @confirm="editBirConfirm"
      />
  </div>
</template>

<script>
import { editUserPro } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'EditUserBir',
  data () {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  // 接收父组件双向绑定传过来的值
  props: {
    value: String
  },
  methods: {
    // 修改生日完成
    async editBirConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true
      })
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      await editUserPro({
        birthday: date
      })
      // const { data } = await editUserPro({ birthday: this.$formatDate(this.userInfo.birthday1) })
      // console.log('this.$formatDate(this.userInfo.birthday1)', this.$formatDate(this.userInfo.birthday1))
      // console.log('修改生日', data)
      this.$emit('input', date)
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
