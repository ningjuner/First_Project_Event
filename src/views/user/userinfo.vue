<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input type="text" v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input type="type" v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input type="text" v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 5px">
        <el-button type="primary" class="btn" @click="submitFn">提交修改</el-button>
        <el-button class="btn" @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserInfoApi } from '@/api'
export default {
  name: 'UserInfo',
  data() {
    return {
      userForm: {
        username: this.$store.state.userinfo.username,
        nickname: '',
        email: ''
      },
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitFn() {
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          // console.log(this.userForm)
          this.userForm.id = this.$store.state.userinfo.id
          const { data: res } = await updateUserInfoApi(this.userForm)
          if (res.code !== 0) return this.$message.error('更新用户信息失败！')
          this.$message.success('更新用户信息成功')
          // 重新让vuex获取下最新的用户数据
          this.$store.dispatch('getUserInfoActions')
        } else {
          return false
        }
      })
    },
    resetFn() {
      /* this.userForm.nickname = ''
      this.userForm.email = '' */
      // el-form 提供的重置表单方法（并且还可以重置报错提示）
      this.$refs.userFormRef.resetFields()
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
.el-form {
  width: 500px;
  .btn {
    float: left;
  }
}
</style>
