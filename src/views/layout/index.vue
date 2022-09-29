<template>
  <el-container>
    <el-aside width="200px">
      <img src="@/assets/images/logo.png" />
      <!-- router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#606266"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        router
      >
        <template v-for="item in menus">
          <!-- 不包含子菜单的“一级菜单” -->
          <el-menu-item :index="item.indexPath" :key="item.indexPath" v-if="!item.children">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </el-menu-item>
          <!-- 包含子菜单的“一级菜单” -->
          <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <!-- 循环渲染“二级菜单” -->
            <el-menu-item v-for="subitem in item.children" :key="subitem.indexPath" :index="subitem.indexPath">
              <i :class="subitem.icon"></i>
              <span>{{ subitem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-menu
          class="el-menu-top"
          mode="horizontal"
          background-color="#606266"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-submenu index="1">
            <template slot="title">
              <!-- 头像 -->
              <img :src="user_pic" alt="" v-if="user_pic" class="avatar" />
              <img src="@/assets/images/avatar.jpg" alt="" class="avatar" v-else />
              <span>个人中心</span>
            </template>
            <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
            <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
            <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
          </el-submenu>
          <el-menu-item index="2" @click="logoutFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
        </el-menu>
        <span>
          欢迎
          <i>{{ nickname || username }}</i>
        </span>
      </el-header>
      <el-main>
        <!-- 二级路由挂载点 -->
        <router-view></router-view>
      </el-main>
      <el-footer>版权</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenuListApi } from '@/api'
export default {
  name: 'Layout',
  data() {
    return {
      menus: []
    }
  },
  methods: {
    logoutFn() {
      this.$confirm('是否确认退出', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          // 确认退出 清除token值和userinfo信息 跳转至login页面
          this.$store.commit('updataTolen', '')
          this.$store.commit('updataUserInfo', {})
          this.$router.push('/login')
        })
        .catch(action => {})
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    async getMenuListFn() {
      const { data: res } = await getMenuListApi()
      // console.log(res.data)
      this.menus = res.data
      // console.log(this.menus)
    }
  },
  created() {
    this.getMenuListFn()
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    /deep/.el-menu {
      float: right;
      .avatar {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}
.el-header {
  span {
    float: right;
    margin-left: 5px;
    i {
      font-style: normal;
    }
  }
}
.el-header,
.el-footer {
  background-color: #606266;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #606266;
  color: #333;
  text-align: center;
  padding-top: 10px;
  /deep/.el-menu {
    margin-top: 10px;
    text-align: left;
  }
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
</style>
