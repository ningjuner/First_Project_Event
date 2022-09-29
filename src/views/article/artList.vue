<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
      </div>
      <div class="search_box">
        <el-form inline :model="q" class="demo-form-inline">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类">
              <el-option :label="obj.cate_name" :value="obj.id" v-for="obj in cateList" :key="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="q.state" placeholder="请选择状态">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="chooseFn">筛选</el-button>
            <el-button type="info" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>
      <!-- 文章表格区域 -->
      <!--
      data 显示的数据  array类型
      stripe 是否为斑马纹 table
      border 是否带有纵向边框
      width 对应列的宽度
     -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link @click.native="getArtDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <!--
            scope变量: {
              row: 行数据对象
            }
            解构赋值 { row }
           -->
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!--
        size-change: pageSize 改变时会触发
        current-change: currentPage 改变时会触发
        current-page: 当前页数，支持 .sync 修饰符
        page-sizes：每页显示个数选择器的选项设置
        page-size：每页显示条目个数，支持.sync 修饰符
        layout: 组件布局，子组件名用逗号分隔
        total：总条目数
       -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @closed="dialogClosedFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
            <el-option :label="obj.cate_name" :value="obj.id" v-for="obj in cateList" :key="obj.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @change="changeContentFn"></quill-editor>
        </el-form-item>
        <el-form-item class="coverItem" prop="cover_img">
          <img src="@/assets/images/cover.jpg" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框 默认被隐藏 -->
          <input
            type="file"
            name=""
            id=""
            ref="iptFileRef"
            style="display: none"
            accept="image/"
            @change="changeCoverFn"
          />
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章详情预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章的封面 -->
      <!-- 注意: cover_img的值, 需要自己拼接服务器前缀地址, 和接口服务的基地址相同 -->
      <img :src="baseURLL + artDetail.cover_img" alt="" v-if="artDetail.cover_img" />
      <!-- 文章的详情 -->
      <!-- v-html 渲染带有html标签的文本 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListApi, pubArticleApi, getArtListApi, getArtDetailApi, deleteArtApi } from '@/api'
import { baseurl } from '@/utils/request'
// 标签和杨世忠 引入图片可以写路径 但在JS代码中需要使用 impot 引入
// 引入之后 webpack 会把图片变为一个 base64 字符串或者打包后的图片临时路径（根据图片大小决定）
import defaultImg from '@/assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data() {
    return {
      // 基地址
      baseURLL: baseurl,
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 控制发表文章对话框的显示与隐藏
      pubDialogVisible: false,
      // 表单的数据对象
      pubForm: {
        title: '', // 文章标题
        cate_id: '', // 文章 id
        content: '', // 文章内容
        cover_img: null, // 用户选择封面图片 null 表示没有人恶化封面
        state: '' // 文章的发布状态 （值：已发布/草稿）
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'change' }]
      },
      // 文章分类
      cateList: [],
      isCheck: false, // 是否校验 content false不校验/true校验
      artList: [], // 文章列表数据
      total: 0, // 总文章数据条数
      detailVisible: false, // 控制文章详情对话框的显示与隐藏
      artDetail: {} // 文章的详情信息对象
    }
  },
  methods: {
    // dialog关闭前的回调
    async handleClose(done) {
      // 询问用户是否确认关闭 dialog 对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消了关闭按钮 什么都不干 直接ruturn
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 获取文章分类数据
    async getArtCateListFn() {
      const { data: res } = await getArtCateListApi()
      this.cateList = res.data
    },
    // 获取文章列表数据
    async getArtListFn() {
      const { data: res } = await getArtListApi(this.q)
      // console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      // this.$message.success(res.message)
      this.artList = res.data
      this.total = res.total
    },
    // 点击事件->文件选择框显示
    chooseImgFn() {
      this.$refs.iptFileRef.click()
    },
    // 监听文件选择框的 change 事件
    changeCoverFn(e) {
      // e.target 可以拿到当前的文件选择框 input   e.target.files可以拿到选择的文件
      const files = e.target.files
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 通过 validateFiled 方法 单独校验规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布文章或草稿 点击事件
    pubArticleFn(state) {
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息！')
        // 3. 判断是否提供了文章封面
        if (!this.pubForm.cover_img) return this.$message.error('请选择文章封面！')
        // console.log(this.pubForm)
        const fd = new FormData()
        Object.keys(this.pubForm).forEach(key => {
          fd.append(key, this.pubForm[key])
        })
        // 给后台发送请求
        const { data: res } = await pubArticleApi(fd)
        if (res.code !== 0) return this.$message.error('发布文章失败！')
        this.$message.success('发布文章成功！')
        console.log(fd)
        // 关闭对话框
        this.pubDialogVisible = false
        // 刷新文章列表
        this.getArtListFn()
      })
    },
    // 文章内容 change 事件
    changeContentFn() {
      if (this.isCheck) {
        this.$refs.pubFormRef.validateField('content')
      }
    },
    //  关闭 dialog 后的处理函数
    dialogClosedFn() {
      // elmentUI自带方法 resetFields 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.pubFormRef.resetFields()
      this.$refs.imgRef.setAttribute('src', defaultImg)
      // 当调用dialog的处理函数的时候 将 isCheck 置为 false 则不校验 content
      this.isCheck = false
    },
    // 核心思想： 根据选择的页码/条数 影响（修改）q对象对应的属性的值 再重新发一次请求让后台重新返回数据
    // pageSize 改变时会触发
    handleSizeChangeFn(nowSize) {
      // nowSize 當前需要每页显示的条数
      this.q.pagesize = nowSize
      this.pagenum = 1
      this.getArtListFn()
    },
    // currentPage 改变时会触发
    handleCurrentChangeFn(nowPage) {
      // nowPage 当前要看的第几页 页数
      this.q.pagenum = nowPage
      this.getArtListFn()
    },
    // 筛选
    chooseFn() {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArtListFn()
    },
    // 重置
    resetFn() {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''
      this.getArtListFn()
    },
    // 获取文章详情点击事件
    async getArtDetailFn(artId) {
      this.detailVisible = true
      const { data: res } = await getArtDetailApi(artId)
      this.artDetail = res.data
      console.log(this.artDetail)
    },
    // 操作按钮点击事件->删除文章
    async removeFn(artId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //  取消了删除
      if (confirmResult === 'cancel') return
      //  执行删除操作
      const { data: res } = await deleteArtApi(artId)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 问题:在最后一页，删除最后一条时，虽然页码能回到上一页，但是数据没有出现
      // 原因:发现network里参数q. pagenum的值不会自己回到上一页，因为你的代码里没有修改过这个q.pagenum值，只是调用getArticleFn方法，带着之前的参数请求去了所以没数据
      // 解决:在调用接口以后，刷新数组列表之前，对页码最一下处理 (if判断)
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      this.getArtListFn()
    }
  },
  created() {
    this.getArtCateListFn()
    this.getArtListFn()
  }
}
</script>

<style lang="less" scoped>
.header-box {
  margin-bottom: 20px;
  span {
    float: left;
  }
}
.search_box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-form {
  .el-form-item {
    text-align: left;
  }
}
.el-pagination {
  text-align: left;
  margin-top: 20px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
// 后端返回图片链接地址的经验://·为何后端返回的图片地址是半截的?
// 原因:·因为服务器的域名可能会来回变化,·所以数据库里的地址只有相对路径
// 要求:·前端请求此图片的时候,后端告诉你图片文件真身所在的服务器域名,前端自己拼接前缀
// 积累知识
// 组件创建时,会用data里的默认值,·让template里标签先渲染一次
// 你的网络请求数据回来, data里变量发生了变化,会让template里使用此变量的地方再次更新dom//·小问题:·第一次渲染的时候无值可能会导致一些报错,但是效果还是出来了
// 解决1:-v-if先不让template里会报错的那个代码先屏蔽执行
// 解决2:可以先给那个对象的属性一个空字符串,别让报错就行
</style>
