<template>
  <div class="editUserPro">
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
    />
    <input type="file" name="" id="" hidden ref="file" @change="onEditAva">
    <van-cell title="头像" is-link :border="false" >
      <van-image
        round
        fit="cover"
        :src="userInfo.photo"
        @click="$refs.file.click()"
      />
    </van-cell>

    <van-cell title="名称" is-link :border="false" :value="userInfo.name" @click="onEditName"/>
    <van-cell title="生日" is-link :border="false" :value="userInfo.birthday" @click="onEditBir" />

    <!-- 修改头像弹出层 -->
    <van-popup
    v-model="isEditPhotoShow"
    position="bottom"
    :style="{ height: '100%' }"
    @opened="onPopupOpened"
    @closed="onPopupClosed"
    >
      <div>
          <img :src="previewImage" alt="" ref="image">
          <van-nav-bar
          class="editAva-bar"
          left-text="取消"
          right-text="确认"
          @click-left="isEditPhotoShow=false"
          @click-right="onUpdateAva"
        />
      </div>

    </van-popup>

    <!-- 修改昵称弹出层-->
    <van-popup v-model="editNameShow" position="top" :style="{ height: '100%' }" class="update-name">
      <van-nav-bar
       class="editName-bar"
        title="修改昵称"
        left-text="取消"
        right-text="完成"
        @click-left="editNameShow = false"
        @click-right="onUpdateName"
      />
      <div class="van-field-w">
      <van-field
        v-model="userInfo.name"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入留言"
        show-word-limit
        v-fofo
      />
    </div>
    </van-popup>

    <!-- 修改生日弹出层 -->
    <van-popup
    v-model ="isEditBirthdayShow"
    position ="bottom"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isEditBirthdayShow = false"
        @confirm="editBirConfirm"
      />

    </van-popup>

  </div>
</template>

<script>
import { getUserProfile, editUserPhoto, editUserPro } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
// import dayjs from 'dayjs'
import { formatDate } from '@/utils/day'
export default {
  name: 'EditUserPro',
  data () {
    return {
      userInfo: {},
      isEditPhotoShow: false,
      previewImage: null, // 预览图片
      cropper: null, // 裁切器实例
      editNameShow: false,
      isEditBirthdayShow: false,
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()// 当前时间
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserProfile()
      console.log('编辑用户资料', data)
      // data.data.birthday1 = new Date(data.data.birthday)
      this.userInfo = data.data
    },
    // 点击修改头像
    async onEditAva () {
      this.isEditPhotoShow = true
      const blob = window.URL.createObjectURL(this.$refs.file.files[0])
      console.log('blob', blob)
      this.previewImage = blob// 把blob直接设置给图片的src
      this.$refs.file.value = ''// 为了解决相同文件不触发change
    },
    // @opened="onPopupOpened"弹出层必须在这个状态下才可以用裁切
    onPopupOpened () {
      // 图片裁切器必须基于img进行初如化
      // img必须是可见状态才能正常完成初始化
      const image = this.$refs.image
      this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true
      })
    },
    onPopupClosed () {
      // 对话框关闭，销毁裁切器
      this.cropper.destroy()
    },
    // 修改头像完成
    onUpdateAva () {
      // 获取裁切的图片对象，文档中有,直接复制使用,裁切的file文件对象
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        console.log(file)
        // 创建formData对象
        const fd = new FormData()
        fd.append('photo', file)// 请求体里加入一对参数名和值
        const { data } = await editUserPhoto(fd)
        console.log(data)
        this.isEditPhotoShow = false
        // 更新视图展示,直接把裁切结果的文件对象转为blob数据本地预览
        // this.userInfo.photo = data.data.photo//得到的是服务端的地址，访问慢
        this.userInfo.photo = window.URL.createObjectURL(file)
      })
    },
    // 修改名字完成
    async onUpdateName () {
      try {
        const { data } = await editUserPro({ name: this.userInfo.name })
        console.log('编辑用户名称', data)
        this.$toast.success('保存成功')
        this.editNameShow = false
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    },
    // 点击编辑名字
    onEditName () {
      this.editNameShow = true
    },
    // 点击修改生日
    onEditBir () {
      this.isEditBirthdayShow = true
      this.currentDate = new Date(this.userInfo.birthday)
    },
    // 修改生日完成
    async editBirConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true
      })
      // const date = dayjs(this.currentDate).format('YYYY-MM-DD')
      await editUserPro({
        birthday: formatDate(this.currentDate)
      })
      // const { data } = await editUserPro({ birthday: this.$formatDate(this.userInfo.birthday1) })
      // console.log('修改生日', data)
      this.userInfo.birthday = formatDate(this.currentDate)// 同步一下数据，不然需要刷新才更新
      this.isEditBirthdayShow = false
      this.$toast.success('保存成功')
    }

  },
  components: {
  }

}
</script>

<style lang="less" scoped>
.van-popup{
  background-color: #f3f4f5;
}
.editUserPro{
  /deep/.van-icon-arrow-left{
    color: #fff;
  }
  .van-image{
    width: 30px;
    height: 30px;
  }
  .editAva-bar{
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    img {
      display: block;
      max-width: 100%;
    }
  }
.update-name{
  .editName-bar{
    background-color: #fff;
    /deep/.van-nav-bar__title{
      color: #000;
    }
  }
  .van-field-w{
    padding: 10px;
  }
}

}

</style>
