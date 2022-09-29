<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div style="width: 400px">
      <img v-if="avatar === ''" src="@/assets/images/avatar.jpg" alt="" />
      <img v-else :src="avatar" alt="" class="the_img" />
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updataAvatarApi } from '@/api'
export default {
  name: 'userAvatar',
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    onFileChange(e) {
      // 拿到用户选择的文件数组
      const files = e.target.files
      if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // img 标签的 src 属性 只能是图片的链接地址(外链的http:// 文件相对路径) 或者是图片的 base64 字符串(而且字符串还必须是 data:image/png;base64, 图片转base64字符串)
        // console.log(files[0])
        // 解决方案一 图片文件转换为内存临时地址（这个地址只能在js内存中使用不能发送费后台） URL.createObjectURL(文件) 返回值是内存临时地址
        // this.avatar = URL.createObjectURL(files[0])
        // 解决方案二 文件转换为 base64 字符串（字符串可以发送给后台）
        const fr = new FileReader()
        // 传入文件对象开始读
        fr.readAsDataURL(files[0])
        // onload 等待把文件读成 base64 字符串后触发 onload 事件函数
        fr.onload = e => {
          // e.target.result 的值就是读完的结果 然后赋给变量 显示在 img 的 src 中
          this.avatar = e.target.result
        }
      }
    },
    chooseImg() {
      // 模拟点击行为
      this.$refs.iptRef.click()
    },
    async uploadFn() {
      const { data: res } = await updataAvatarApi(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('getUserInfoActions')
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix {
  padding-bottom: 20px;
  span {
    float: left;
  }
}
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
