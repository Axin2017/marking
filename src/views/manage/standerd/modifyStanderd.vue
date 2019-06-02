<template>
  <div class="standerd-wrapper">
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDialogShow">添加</el-button>
    <div v-show="isNoData" class="nodata">暂时没有数据</div>
    <el-row :gutter="60">
      <el-col v-for="standerd in standerdList" :key="standerd._id" :span="6">
        <el-card class="standerd-card">
          <div slot="header" class="">
            <span>{{ standerd.name }}</span>
            <el-button class="opbutton" type="text" icon="el-icon-delete" title="删除" @click="delStanderd(standerd._id)" />
            <el-button class="opbutton" type="text" icon="el-icon-edit" title="编辑" @click="editStanderd(standerd)" />
          </div>
          <div>
            <ul>
              <li v-for="item in standerd.standerd" :key="item.name" class="item">
                {{ item.name }}:{{ item.weight }}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="isEdit?'编辑':'添加'" :visible="addDialogVisible" width="400px" class="add-dialog" center :show-close="false">
      <el-form label-width="80px" :model="standerdForm">
        <el-form-item label="名称">
          <el-input v-model="standerdForm.name" />
        </el-form-item>
        <el-form-item label="标准/权重">
          <div class="add-standerd-box">
            <el-row v-for="(s,index) in standerdForm.standerd" :key="index" class="add-standerd-row" :gutter="5">
              <el-col :span="11">
                <el-input v-model="s.name" placeholder="输入标准项" />
              </el-col>
              <el-col :span="11">
                <el-input v-model.number="s.weight" placeholder="输入权重" />
              </el-col>
              <el-col :span="1">
                <el-button type="text" icon="el-icon-delete" @click="removeStanderd(s)" />
              </el-col>
            </el-row>
            <el-row class="add-standerd-row">
              <el-button class="add-standerd-button" type="primary" icon="el-icon-plus" @click="addStanderdItem">新增</el-button>
            </el-row>
          </div>
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
import standerdApi from '@/api/standerd'
export default {
  name: 'ModifyStanderd',
  components: {},
  props: [],
  data() {
    this.standerdFormTemp = {
      name: '',
      standerd: [
        {
          name: '',
          weight: 0
        }
      ]
    }
    return {
      standerdList: [],
      addDialogVisible: false,
      standerdForm: {
        standerd: [
          {
            name: '',
            weight: 0
          }
        ],
        name: ''
      },
      isEdit: false,
      isNoData: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getStanderdListData()
  },
  methods: {
    getStanderdListData() {
      standerdApi.getStanderd().then(standerdList => {
        this.standerdList = standerdList
        if (this.standerdList && this.standerdList.length) {
          this.isNoData = false
        } else {
          this.isNoData = true
        }
      })
    },
    addDialogShow() {
      this.addDialogVisible = true
    },
    removeStanderd(s) {
      let index = -1
      const standerd = this.standerdForm.standerd
      for (let i = 0; i < standerd.length; i++) {
        if (standerd[i].name === s.name) {
          index = i
          break
        }
      }
      this.standerdForm.standerd.splice(index, 1)
    },
    addStanderdItem() {
      this.standerdForm.standerd.push({ name: '', weight: 0 })
    },
    cancelAdd() {
      this.isEdit = false
      this.standerdForm = this.standerdFormTemp
      this.addDialogVisible = false
    },
    commit() {
      if (!this.standerdForm.name) {
        this.$message.error('名称为必填项')
        return
      }
      const hasEmptyName = this.standerdForm.standerd.some(s => {
        return !s.name || isNaN(s.weight)
      })
      if (hasEmptyName) {
        this.$message.error('评分标准不合法')
        return
      }
      if (this.isEdit) {
        // 更新
        standerdApi.updateStanderd({ query: { _id: this.standerdForm._id }, set: this.standerdForm }).then(r => {
          this.$message.success('更新成功')
          this.standerdList = []
          this.addDialogVisible = false
          this.standerdForm = this.standerdFormTemp
          this.getStanderdListData()
        })
      } else {
        // 新增
        standerdApi.addStanderd(this.standerdForm).then(r => {
          this.$message.success('添加成功')
          this.standerdList = []
          this.addDialogVisible = false
          this.standerdForm = this.standerdFormTemp
          this.getStanderdListData()
        })
      }
    },
    delStanderd(id) {
      this.$confirm('此操作将删除该标准, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          standerdApi.delStanderd({ _id: id }).then(r => {
            this.$message.success('删除成功')
            this.standerdList = []
            this.addDialogVisible = false
            this.getStanderdListData()
          })
        })
        .catch(() => {})
    },
    editStanderd(standerd) {
      this.isEdit = true
      this.standerdForm = { ...standerd }
      this.addDialogVisible = true
    }
  }
}
</script>
<style scoped>
.standerd-wrapper {
  padding: 30px;
}
.standerd-card {
  margin-top: 40px;
}
.item {
  list-style: none;
  margin-top: 10px;
}
.opbutton {
  float: right;
  margin-left: 5px;
  font-size: 14px;
}
.add-standerd-button {
  width: 100%;
}
.add-standerd-row {
  margin-top: 5px;
}
.nodata{
  padding: 50px;
  text-align: center;
}
</style>
