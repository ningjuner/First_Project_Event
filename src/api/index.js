import request from '@/utils/request'
/**
 *
 * @param {*} param0 {username: 用户名, password: 密码, repassword: 确认密码}
 * @returns Promise 对象
 */
export const regListApi = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 *
 * @param {*} param0 {username: 用户名, password: 密码}
 * @returns Promise 对象
 */
export const loginApi = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取-用户信息
 * @returns Promise 对象
 */
export const getUserInfoApi = () => {
  return request({
    url: '/my/userinfo'
  })
}

/**
 * 获取-侧边单数据
 * @returns Promise 对象
 */
export const getMenuListApi = () => {
  return request({
    url: '/my/menus'
  })
}

/**
 *耿欣-用户信息
 * @param {*} param0 {id, username 用户名, nickname 昵称, email 邮箱, user_pic 头像}
 * @returns Promise 对象
 */
export const updateUserInfoApi = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 * 耿欣-用户头像
 * @param {*} avatar avatar 用户头像
 * @returns Promise对象
 */
export const updataAvatarApi = avatar => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 修改-用户密码
 * @param {*} param0 {old_pwd 旧密码, new_pwd 新密码, re_pwd 确认新密码}
 * @returns Promise对象
 */
export const updataPwdApi = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 * 获取-文章分类
 * @returns Promise对象
 */
export const getArtCateListApi = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加-文章分类
 * @param {*} param0 {cate_name 文章分类名字, cate_alias 文章分类别}
 * @returns Promise对象
 */
export const addArtCateList = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新-文章分类
 * @param {*} param0 {id 文章分类id, cate_alias 文章分类别名, cate_name 文章分类名称}
 * @returns Promise对象
 */
export const updateArtCateInfoApi = ({ id, cate_alias, cate_name }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除-文章分类
 * @param {*} id {id 文章分类id}
 * @returns Promise对象
 */
export const delArtCateApi = id => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 发布文章
 * @param {*} fd
 * @returns Promise对象
 */
export const pubArticleApi = fd => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd
  })
}

/**
 * 获取-文章列表
 * @param {*} param0 { pagenum 当前页码数, pagesize 当前页面需要的数据条数, cate_id 文章分类id(注意不是文章id), state 章状态("已发布"和"草稿")2种值 }
 * @returns Promise对象
 */
export const getArtListApi = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取-文章详情
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const getArtDetailApi = id => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除-文章
 * @param {*} id 文章id
 * @returns Promise对象
 */
export const deleteArtApi = id => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
