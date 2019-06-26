<template>
  <div class="add-marking-wrapper">
    <div class="function-box">
      选择组织:
      <el-select v-model="nowOrg" placeholder="请选择">
        <el-option v-for="org in orgList" :key="org._id" :label="org.name" :value="org._id" />
      </el-select>
      <template v-if="nowOrg">
        <el-input ref="title" v-model="title" class="title-box" placeholder="请输入评分标题" />
        <el-button type="success" class="commit-btn" @click="expandAll">全部展开</el-button>
        <el-button type="success" class="commit-btn" @click="unexpandAll">全部收起</el-button>
        <el-button type="primary" class="commit-btn" @click="commit">提交</el-button>
      </template>
    </div>
    <div v-if="nowOrg" class="content-box">
      <el-table :data="currentMarkingList" row-class-name="pointer" style="width: 100%" row-key="username" :expand-row-keys="expandRowKeys" @row-click="rowClick">
        <el-table-column type="expand">
          <div slot-scope="props" class="score-table">
            <el-table :data="props.row.standerdScore" style="width: 100%">
              <el-table-column label="标准" prop="name" />
              <el-table-column label="权重" prop="weight" />
              <el-table-column label="评分" prop="score">
                <template slot-scope="stand">
                  <el-input v-model="stand.row.score" @change="calcTotal(props.row)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-table-column>
        <el-table-column label="姓名" prop="username" sortable />
        <el-table-column label="总分" prop="totalScore" sortable />
      </el-table>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import markingApi from '@/api/marking'
import { getOrg } from '@/api/org'
export default {
  name: 'AddMarking',
  components: {},
  data() {
    return {
      orgList: [],
      nowOrg: '',
      currentMarkingList: [],
      expandRowKeys: [],
      title: ''
    }
  },
  watch: {
    nowOrg() {
      if (this.nowOrg) {
        const currentOrg = JSON.parse(JSON.stringify(this.orgList.find(o => o._id === this.nowOrg)))
        if (!currentOrg.standerd || !currentOrg.users) {
          this.$message.error('读取组织评分标准或组织用户失败，请先给组织添加标准和用户')
          return
        }
        const currentStanderd = currentOrg.standerd.standerd.map(s => {
          const standerScore = { ...s }
          standerScore.score = 0
          return standerScore
        })
        currentOrg.users.forEach(user => {
          user.standerdScore = JSON.parse(JSON.stringify(currentStanderd))
          user.totalScore = 0
        })
        this.currentMarkingList = currentOrg.users
      } else {
        this.currentMarkingList = []
      }
    }
  },
  mounted() {
    this.getOrgData()
  },
  methods: {
    refresh() {
      this.nowOrg = ''
      this.currentMarkingList = []
      this.expandRowKeys = []
      this.title = []
    },
    calcTotal(marking) {
      const totalWeight = marking.standerdScore.reduce((total, current) => {
        return total + parseInt(current.weight)
      }, 0)
      let totalScore = marking.standerdScore.reduce((total, current) => {
        return (
          parseFloat(total) +
          parseInt(current.score) * current.weight / totalWeight
        )
      }, 0)
      if ((totalScore + '').indexOf('.') > -1) {
        totalScore = totalScore.toFixed(2)
      }
      marking.totalScore = totalScore
      const index = this.currentMarkingList.findIndex(e => e._id === marking._id)
      this.$set(this.currentMarkingList, index, marking)
    },
    rowClick(row, event, column) {
      if (this.expandRowKeys.includes(row.username)) {
        this.expandRowKeys.splice(this.expandRowKeys.indexOf(row.username), 1)
      } else {
        this.expandRowKeys.push(row.username)
      }
    },
    expandAll() {
      const allKeys = []
      this.currentMarkingList.forEach(marking => {
        allKeys.push(marking.username)
      })
      this.expandRowKeys = allKeys
    },
    unexpandAll() {
      this.expandRowKeys = []
    },
    commit() {
      if (!this.title) {
        this.$message({
          message: '请输入标题信息',
          type: 'warning'
        })
        this.$refs.title.focus()
        return
      }
      markingApi
        .addMarking({ title: this.title, marking: this.currentMarkingList, addDate: parseTime(new Date()), updateDate: '' })
        .then(r => {
          this.$message.success('添加成功')
          this.refresh()
        })
        .catch(e => {
          this.$message.error('添加评分失败')
          console.log(e)
        })
    },
    getOrgData() {
      getOrg().then(orgList => {
        this.orgList = orgList
      }).catch((e) => {
        console.log(e)
        this.$message.error('获取组织列表失败')
      })
    }
  }
}
</script>
<style scoped>
.add-marking-wrapper {
  padding: 0 20px;
}
.function-box,
.content-box {
  width: 100%;
  margin-top: 50px;
}
.score-table {
  width: 50%;
  padding: 10px;
  background-color: #ccc;
}
.title-box {
  width: 300px;
}
</style>
