import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoApi } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userinfo: {}
  },
  getters: {
    /*    username(state) {
      return state.userinfo.username
    } */
    username: state => state.userinfo.username,
    nickname: state => state.userinfo.nickname,
    user_pic: state => state.userinfo.user_pic
  },
  mutations: {
    updataTolen(state, newToken) {
      state.token = newToken
    },
    updataUserInfo(state, val) {
      state.userinfo = val
    }
  },
  actions: {
    async getUserInfoActions(store) {
      const { data: res } = await getUserInfoApi()
      // console.log(res.data)
      store.commit('updataUserInfo', res.data)
    }
  },
  modules: {},
  plugins: [createPersistedState()]
})
