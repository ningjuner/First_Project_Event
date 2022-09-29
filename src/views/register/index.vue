<template>
  <div class="reg-container">
    <div class="reg-box">
      <div class="title-box"></div>
      <el-form :model="form" ref="regRef" :rules="regRules">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" type="text" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input placeholder="请再次输入密码" type="password" v-model="form.repassword"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 10px">
          <el-button type="primary" class="btn-reg" @click="registerFn">注册</el-button>
        </el-form-item>
        <el-link type="info" :underline="false" @click="$router.push('/login')">去登录</el-link>
      </el-form>
    </div>
  </div>
</template>

<script>
import { regListApi } from '@/api/index'
export default {
  name: 'Register',
  data() {
    const samePwd = (rele, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      form: {
        // 注册表单的数据对象
        username: '',
        password: '',
        repassword: ''
      },
      regRules: {
        // 注册表单的验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10位的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerFn() {
      this.$refs.regRef.validate(async valid => {
        if (valid) {
          // console.log(this.form)
          const { data: res } = await regListApi(this.form)
          console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // 注册成功跳转至登录页面
          this.$router.push('/login')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('@/assets/images/bg.jpg') center;
  background-size: cover;
  height: 100%;
  .reg-box {
    width: 400px;
    height: 335px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      background: url('@/assets/images/login_title.png') center no-repeat;
    }
    .btn-reg {
      width: 100%;
    }
  }
}
</style>
