<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import { getAllChannels } from '@/api/channels'

export default {
  async created () {
    const res = await getAllChannels()
    console.log('获取所有频道', res)
  }
}
</script>

<style lang="less" scoped>

</style>
