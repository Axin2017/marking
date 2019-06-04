<template>
  <div class="org-wrapper">
    <el-button type="primary" class="org-add" icon="el-icon-plus" @click="addDialogShow">添加</el-button>
    <div v-show="isNoData" class="nodata">暂时没有数据</div>
    <div class="org-user-box">
      <div class="org-box">
        <el-collapse v-model="activeName" accordion class="org-list" @change="orgActivedChange">
          <el-collapse-item v-for="(org,i) in orgList" :key="i" :name="org.name">
            <template slot="title">
              <span class="org-title">{{ org.name }}</span>
              <el-button type="text" class="org-rename" icon="el-icon-edit" title="改名" @click.stop="editOrg(org)" />
              <el-button type="text" class="org-remove" icon="el-icon-delete" title="删除" @click.stop="removeOrg(org)" />
            </template>
            <el-tag v-for="user in org.users" :key="user._id" class="user-tag" closable @close="removeUser(org,user,i)">
              {{ user.username }}
            </el-tag>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-for="(org,i) in orgList" v-show="currentName === org.name" :key="i" class="user-box">
        <div class="header">人员选择</div>
        <ul>
          <li v-for="u in org.userList" :key="u._id" class="user-item">
            <el-checkbox v-model="u.checked" @change="userChange(u,org,i)">{{ u.username }}</el-checkbox>
          </li>
        </ul>
      </div>
      <el-dialog :title="isEdit?'编辑':'添加'" :visible="addDialogVisible" width="400px" class="add-dialog" center :show-close="false">
        <el-form label-width="80px" :model="orgForm">
          <el-form-item label="名称">
            <el-input v-model="orgForm.name" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd">取 消</el-button>
          <el-button type="primary" @click="commit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div></template>
<script>
import { getOrg, deleteOrg, addOrg, updateOrg } from '@/api/org'
import { getUser } from '@/api/user'
export default {
  name: '',
  components: {},
  props: [],
  data() {
    this.orgFormTemp = {
      name: '',
      users: []
    }
    return {
      orgList: [],
      addDialogVisible: false,
      orgForm: {
        name: '',
        users: []
      },
      currentName: '',
      isEdit: false,
      isNoData: false,
      activeName: ''
    }
  },
  computed: {
  },
  watch: {},
  created() {},
  mounted() {
    this.getOrgAndUserList()
  },
  beforeDestroy() {
    this.saveUpdatedOrg()
  },
  methods: {
    // 用户选中状态改变
    userChange(user, org, i) {
      if (user.checked) {
        org.users.push(user)
      } else {
        let index = -1
        for (let i = 0; i < org.users.length; i++) {
          if (org.users[i]._id === user._id) {
            index = i
            break
          }
        }
        org.users.splice(index, 1)
      }
      org.isUpdate = true
      this.$set(this.orgList, i, org)
    },
    // 激活不同的组织机构
    orgActivedChange(name) {
      if (!name) {
        return
      }
      this.currentName = name
      this.saveUpdatedOrg()
    },
    // 保存更新后的组织机构
    saveUpdatedOrg() {
      for (let i = 0; i < this.orgList.length; i++) {
        const o = this.orgList[i]
        if (o.isUpdate) {
          o.isUpdate = false
          // 构建更新对象
          const { _id, users, name } = o
          const updateUsers = users.map(u => {
            const { _id, username, password, sex } = u
            return { _id, username, password, sex }
          })
          updateOrg({ query: { _id: o._id }, set: { _id, users: updateUsers, name }}).catch(e => {
            console.log(e)
          })
        }
      }
    },
    // 获取组织机构和用户列表，先获取用户列表，以免组织机构列表出来的时候，机构没出来
    getOrgAndUserList() {
      getUser().then(userList => {
        getOrg().then(orgList => {
          this.orgList = orgList
          if (this.orgList && this.orgList.length) {
            this.isNoData = false
          } else {
            this.isNoData = true
          }
          this.orgList.forEach(o => {
            o.userList = JSON.parse(JSON.stringify(userList))
            o.users = o.users || []
            for (let i = 0; i < o.userList.length; i++) {
              if (o.users.some(u => u._id === o.userList[i]._id)) {
                o.userList[i].checked = true
              }
            }
          })
        })
      })
    },
    addDialogShow() {
      this.addDialogVisible = true
    },
    cancelAdd() {
      this.isEdit = false
      this.orgForm = this.orgFormTemp
      this.addDialogVisible = false
    },
    commit() {
      if (!this.orgForm.name) {
        this.$message.error('请将必填项填完整')
        return
      }
      if (this.isEdit) {
        // 更新
        updateOrg({
          query: { _id: this.orgForm._id },
          set: { $set: { name: this.orgForm.name }}
        }).then(r => {
          this.$message.success('更新成功')
          this.orgList = []
          this.cancelAdd()
          this.getOrgAndUserList()
        })
      } else {
        // 新增
        addOrg(this.orgForm).then(r => {
          this.$message.success('添加成功')
          this.orgList = []
          this.cancelAdd()
          this.getOrgAndUserList()
        })
      }
    },
    removeOrg(org) {
      this.$confirm('此操作将删除该组织机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOrg({ _id: org._id }).then(r => {
            this.$message.success('删除成功')
            this.orgList = []
            this.getOrgAndUserList()
          })
        })
        .catch(() => {})
    },
    editOrg(org) {
      this.isEdit = true
      this.orgForm = { ...org }
      this.addDialogVisible = true
    },
    // 组织机构中删除用户
    removeUser(org, user, i) {
      let userIndex = -1
      for (let i = 0; i < org.users.length; i++) {
        if (org.users[i]._id === user._id) {
          userIndex = i
          break
        }
      }
      org.users.splice(userIndex, 1)
      for (let i = 0; i < org.userList.length; i++) {
        if (org.userList[i]._id === user._id) {
          org.userList[i].checked = false
          break
        }
      }
      org.isUpdate = true
      this.$set(this.orgList, i, org)
    }
  }
}
</script>
<style scoped>
.org-wrapper {
  padding: 30px;
}
.org-box,
.user-box {
  position: relative;
  height: 500px;
  padding: 10px;
  overflow: auto;
  box-shadow: 0 0 5px 1px #ccc;
}
.org-box {
  width: 500px;
}
.user-box {
  width: 250px;
  margin-left: 90px;
}
.org-user-box {
  width: 1000px;
  padding: 20px;
  margin: 100px auto;
}
.org-user-box > div {
  display: inline-block;
}
.org-add {
  margin-top: 10px;
}
.org-title {
  margin-left: 5px;
}
.org-remove {
  position: absolute;
  right: 40px;
}
.org-rename {
  position: absolute;
  right: 60px;
}
.user-tag{
  margin-right: 5px;
}
.user-item{
  padding-left: 5px;
  list-style: none;
  margin-bottom: 5px;
}
.header{
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
