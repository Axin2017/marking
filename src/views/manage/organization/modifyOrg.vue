<template>
  <div class="org-wrapper">
    <div v-show="isNoData" class="nodata">暂时没有数据</div>
    <div class="org-user-box">
      <div class="org-box">
        <!-- <el-collapse v-model="activeName" accordion class="org-list" @change="orgActivedChange">
          <el-collapse-item v-for="(org,i) in orgList" :key="i" :name="org.name">
            <template slot="title">
              <span class="org-title">{{ org.name }}</span>
              <el-button type="text" class="org-rename" icon="el-icon-edit" title="改名" @click="rename(org)" />
              <el-button type="text" class="org-remove" icon="el-icon-delete" title="删除" @click.stop="removeOrg(org)" />
            </template>
            <el-tag v-for="user in org.users" :key="user._id" closable @close="removeUser(org,user)">
              {{ user.username }}
            </el-tag>
          </el-collapse-item>
        </el-collapse> -->
        <div v-for="(org,i) in orgList" :key="i">
          <div @click="setCurrentName(org.name)">{{ org.name }}</div>
          <el-tag v-for="user in org.users" :key="user._id" closable @close="removeUser(org,user)">
            {{ user.username }}
          </el-tag>
        </div>
        <!-- <el-button type="primary" class="org-add" icon="el-icon-plus" @click="addDialogShow" /> -->
      </div>
      <div v-for="(org,i) in orgList" v-show="currentName === org.name" :key="i" class="user-box">
        <!-- <el-tree :data="org.userList" show-checkbox node-key="_id" :default-checked-keys="org.orgUserIdList" :props="defaultProps" @check="userChange" /> -->
        <ul>
          <li v-for="u in org.userList" :key="u._id"><input v-model="u.checked" type="checkbox" @change="userChange(u,org)">{{ u.username }}</li>
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
      name: ''
    }
    this.defaultProps = {
      label: 'username'
    }
    return {
      orgList: [],
      userList: [],
      orgUserIdList: [],
      addDialogVisible: false,
      orgForm: {
        name: ''
      },
      currentName: '',
      isEdit: false,
      isNoData: false,
      activeName: ''
    }
  },
  computed: {
    userListMapObj() {
      const userListMapOjb = {}
      this.userList.forEach(u => {
        userListMapOjb[u._id] = u
      })
      return userListMapOjb
    },
    currentOrg() {
      const list = this.orgList.filter(o => o.name === this.currentName)
      if (list.length) {
        return list[0]
      } else {
        return null
      }
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getOrgAndUserList()
  },
  methods: {
    setCurrentName(name) {
      this.currentName = name
    },
    // 用户选中状态
    userChange(user, org) {
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
    },
    getCheckedUsers(checkedKeys) {
      const checkedUsers = []
      checkedKeys.forEach(u => {
        checkedUsers.push({ ...this.userListMapObj[u] })
      })
      return checkedUsers
    },
    orgActivedChange(name) {
      if (!name) {
        return
      }
      this.currentName = name
      this.saveUpdatedOrg()
    },
    saveUpdatedOrg() {
      const hasUpdadeList = this.orgList.filter(o => o.isUpdate)
      if (hasUpdadeList.length > 0) {
        hasUpdadeList.forEach(updatedOrg => {
          delete updateOrg.isUpdate
          updateOrg({ _id: updatedOrg._id, set: updateOrg }).catch(e => {
            console.log(e)
          })
        })
      }
    },
    getOrgAndUserList() {
      getUser().then(userList => {
        this.userList = userList
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
            o.orgUserIdList = Array.isArray(o.users)
              ? o.users.reduce((total, current) => {
                total.push(current.name)
                return total
              }, [])
              : []
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
      if (
        !this.orgForm.orgname ||
        !this.orgForm.password ||
        !this.orgForm.sex
      ) {
        this.$message.error('请将必填项填完整')
        return
      }
      if (this.isEdit) {
        // 更新
        updateOrg({
          query: { _id: this.orgForm._id },
          set: this.orgForm
        }).then(r => {
          this.$message.success('更新成功')
          this.orgList = []
          this.addDialogVisible = false
          this.orgForm = this.orgFormTemp
          this.getOrgList()
        })
      } else {
        // 新增
        addOrg(this.orgForm).then(r => {
          this.$message.success('添加成功')
          this.orgList = []
          this.addDialogVisible = false
          this.orgForm = this.orgFormTemp
          this.getOrgList()
        })
      }
    },
    removeOrg(org) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOrg({ _id: org._id }).then(r => {
            this.$message.success('删除成功')
            this.orgList = []
            this.addDialogVisible = false
            this.getOrgList()
          })
        })
        .catch(() => {})
    },
    rename(org) {},
    editOrg(org) {
      this.isEdit = true
      this.orgForm = { ...org }
      this.addDialogVisible = true
    },
    removeUser(org, user) {
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
  width: 100%;
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
</style>
