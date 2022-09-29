<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogBtnFn">添加分类</el-button>
      </div>
      <!--
      data 显示的数据  array类型
      stripe 是否为斑马纹 table
      border 是否带有纵向边框
      prop 对应列内容的字段名，也可以使用 property 属性 string类型
      width 对应列的宽度
      size Table的尺寸 string类型  可取值：medium / small / mini
      index 如果设置了 type=index，可以通过传递 index 属性来自定义索引
     -->
      <el-table style="width: 100%" border stripe :data="cateList">
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delArtCate(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <!--
      .sync作用实现双向数据绑定
      会在运行时给所在标签绑定 @update:属性名的事件, 把接收到子组件内传来的值赋予给右侧Vue变量
      组件内$emit('update:visible', true)
      这个update: 是固定的
      close Dialog 关闭的回调
    -->
    <el-dialog title="添加文章分类" :visible.sync="dialogVisible" width="35%" @closed="dialogCloseFn">
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">确 定</el-button>
      </span>
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListApi, addArtCateList, updateArtCateInfoApi, delArtCateApi } from '@/api'
export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [],
      // 添加分类-对话框是否显示
      dialogVisible: false,
      // 添加表单的数据对象
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 添加表单的验证规则对象
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      editId: '', // 要修改的文章id
      isEdit: false // 保存编辑状态(false新增, true修改)
    }
  },
  methods: {
    // （初始化）获取文章分类列表
    async initCateListFn() {
      const { data: res } = await getArtCateListApi()
      this.cateList = res.data
    },
    // 对话框确定按钮 点击事件 让对相框消失/调用保存文章分类接口
    confirmFn() {
      this.$refs.addRef.validate(async vaild => {
        if (vaild) {
          // 通过表单校验
          if (this.isEdit) {
            // 修改文章分类
            const { data: res } = await updateArtCateInfoApi({ id: this.editId, ...this.addForm })
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 添加文章分类
            const { data: res } = await addArtCateList(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }
        } else {
          // 没通过表单校验
          return false
        }
        // 重新请求列表数据
        this.initCateListFn()
        // 关闭对话框
        this.dialogVisible = false
      })
    },
    // 取消按钮点击事件 dialog对话框隐藏
    cancelFn() {
      this.dialogVisible = false
    },
    // 关闭dialog对话框按钮
    dialogCloseFn() {
      this.$refs.addRef.resetFields()
    },
    // 修改分类按钮->点击事件
    updateCateBtnFn(obj) {
      // console.log(obj)
      this.isEdit = true
      this.editId = obj.id
      this.dialogVisible = true
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 添加分类按钮点击事件（显示dialog对话框）
    addCateShowDialogBtnFn() {
      this.isEdit = false
      this.editId = ''
      this.dialogVisible = true
    },
    async delArtCate(id) {
      // 询问是否继续删除
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消 -> 不删除
      if (confirmResult === 'cancel') return
      // 确认 -> 删除操作
      const { data: res } = await delArtCateApi(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.initCateListFn()
    }
  },
  created() {
    this.initCateListFn()
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
