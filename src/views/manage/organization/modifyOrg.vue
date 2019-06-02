<template>
  <div class="org-wrapper">
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDialogShow">添加</el-button>
    <div v-show="isNoData" class="nodata">暂时没有数据</div>
    <el-row>
      <el-col :span="12">
        <div class="org-list">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item v-for="(org,i) in orgList" :key="i" :title="org.name" :name="org.name">
              <el-tag
                v-for="user in org.users"
                :key="user._id"
                closable
                @close="removeUser(org,user)"
              >
                {{ user.username }}
              </el-tag>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
      <el-col :span="8" :offset="2">
        <div class="user-list" />
      </el-col>
      <el-row>

        <el-dialog :title="isEdit?'编辑':'添加'" :visible="addDialogVisible" width="400px" class="add-dialog" center :show-close="false">
          <el-form label-width="80px" :model="orgForm" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="commit">确 定</el-button>
          </span>
        </el-dialog>
      </el-row></el-row></div>
</template>
<script>
import { getOrg, deleteOrg, addOrg, updateOrg } from '@/api/org'
export default {
  name: '',
  components: {},
  props: [],
  data() {
    this.orgFormTemp = {
      orgname: '',
      sex: '',
      password: ''
    }
    return {
      orgList: [],
      addDialogVisible: false,
      orgForm: {
        orgname: '',
        sex: '男',
        password: ''
      },
      isEdit: false,
      isNoData: false,
      activeName: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getOrgList()
  },
  methods: {
    getOrgList() {
      getOrg().then(orgList => {
        this.orgList = orgList
        if (this.orgList && this.orgList.length) {
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
    delOrg(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOrg({ _id: id }).then(r => {
            this.$message.success('删除成功')
            this.orgList = []
            this.addDialogVisible = false
            this.getOrgList()
          })
        })
        .catch(() => {})
    },
    editOrg(org) {
      this.isEdit = true
      this.orgForm = { ...org }
      this.addDialogVisible = true
    },
    removeUser(org, user) {

    }
  }
}
</script>
<style scoped>
.org-wrapper {
  padding: 30px;
}
.org-list {
  height: 600px;
  overflow: auto;
}
</style>
