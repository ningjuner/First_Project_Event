<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title-box"></div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updataTolen']),
    loginFn() {
      this.$refs.loginRef.validate(async valid => {
        if (valid) {
          const { data: res } = await loginApi(this.loginForm)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.updataTolen(res.token)
          // 登录成功之后，跳转到后台主页
          this.$router.push('/')
          // this.$store.dispatch('getUserInfoActions')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url('@/assets/images/bg.jpg') center;
  background-size: cover;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-box {
    width: 400px;
    height: 270px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
    padding: 0 30px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      background: url('@/assets/images/login_title.png') center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
