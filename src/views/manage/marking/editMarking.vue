<template>
  <div class="add-marking-wrapper">
    <div class="function-box">
      评分标题：{{ title }}
      <el-button type="success" class="commit-btn" @click="expandAll">全部展开</el-button>
      <el-button type="success" class="commit-btn" @click="unexpandAll">全部收起</el-button>
      <el-button type="primary" class="commit-btn" @click="commit">提交</el-button>
    </div>
    <div class="content-box">
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
export default {
  name: 'EditMarking',
  components: {},
  data() {
    return {
      currentMarkingList: [],
      expandRowKeys: [],
      title: '',
      marking: null
    }
  },
  mounted() {
    this.getMarkingData()
  },
  methods: {
    getMarkingData() {
      markingApi.getMarking({ _id: this.id }).then(marking => {
        if (marking.length) {
          this.marking = marking[0]
          this.currentMarkingList = this.marking.marking
          this.title = this.marking.title
        }
      }).catch(e => { console.log(e) })
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
      this.marking.updateDate = parseTime(new Date())
      markingApi.updateMarking({
        query: { _id: this.marking._id },
        set: this.marking
      }).then(r => {
        this.$message.success('更新成功')
      }).catch(e => {
        console.log(e)
        this.$message.error('更新失败')
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
