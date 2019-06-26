<template>
  <div class="user-wrapper">
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDialogShow">添加</el-button>
    <div v-show="isNoData" class="nodata">暂时没有数据</div>
    <div class="user-list">
      <el-row :gutter="20">
        <el-col v-for="user in userList" :key="user._id" :span="2">
          <div v-if="user.username !== '超级管理员'" class="user-box">
            <div :class="user.sex === '女'?'user-img-girl':'user-img-boy'" />
            <div class="user-name">
              {{ user.username }}
            </div>
            <div class="op-box">
              <el-button type="text" icon="el-icon-edit" title="编辑" @click="editUser(user)" />
              <el-button type="text" icon="el-icon-delete" title="删除" @click="delUser(user._id)" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="isEdit?'编辑':'添加'" :visible="addDialogVisible" width="400px" class="add-dialog" center :show-close="false">
      <el-form label-width="80px" :model="userForm">
        <el-form-item label="姓名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userForm.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password" />
        </el-form-item>
        <el-form-item label="权限">
          <el-checkbox-group v-model="userForm.roles">
            <el-checkbox label="admin">管理员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUser, deleteUser, addUser, updateUser } from '@/api/user'
export default {
  name: '',
  components: {},
  props: [],
  data() {
    this.userFormTemp = {
      username: '',
      sex: '男',
      password: '',
      roles: []
    }
    return {
      userList: [],
      addDialogVisible: false,
      userForm: {
        username: '',
        sex: '男',
        password: '',
        roles: []
      },
      isEdit: false,
      isNoData: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getUser().then(userList => {
        this.userList = userList
        // 超级管理员不显示
        if (this.userList && this.userList.length > 1) {
          this.isNoData = false
        } else {
          this.isNoData = true
        }
      })
    },
    addDialogShow() {
      this.addDialogVisible = true
    },
    cancelAdd() {
      this.isEdit = false
      this.userForm = this.userFormTemp
      this.addDialogVisible = false
    },
    commit() {
      if (!this.userForm.username || !this.userForm.password || !this.userForm.sex) {
        this.$message.error('请将必填项填完整')
        return
      }
      if (this.isEdit) {
        // 更新
        updateUser({
          query: { _id: this.userForm._id },
          set: this.userForm
        }).then(r => {
          this.$message.success('更新成功')
          this.userList = []
          this.cancelAdd()
          this.getUserList()
        })
      } else {
        // 新增
        addUser(this.userForm).then(r => {
          this.$message.success('添加成功')
          this.userList = []
          this.cancelAdd()
          this.getUserList()
        })
      }
    },
    delUser(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser({ _id: id }).then(r => {
            this.$message.success('删除成功')
            this.userList = []
            this.getUserList()
          })
        })
        .catch(() => {})
    },
    editUser(user) {
      this.isEdit = true
      this.userForm = { ...this.userForm, ...user }
      this.addDialogVisible = true
    }
  }
}
</script>
<style scoped>
.user-wrapper {
  padding: 30px;
}
.user-list {
  padding: 30px;
}
.user-box {
  margin: auto;
  padding: 10px;
}
.user-box:hover {
  background-color: #eee;
}
.op-box {
  visibility: hidden;
  text-align: center;
}
.user-box:hover > .op-box {
  visibility: visible;
}
.user-img-boy {
  height: 32px;
  background: url('../../../assets/user/boy_32.png') no-repeat center;
}
.user-img-girl {
  height: 32px;
  background: url('../../../assets/user/girl_32.png') no-repeat center;
}
.user-name {
  margin: 5px auto;
  text-align: center;
}
.nodata{
  padding: 50px;
  text-align: center;
}
</style>
