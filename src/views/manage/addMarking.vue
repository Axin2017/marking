<template>
  <div class="add-marking-wrapper">
    <div class="type-box">
      选择类别:
      <el-select v-model="type" placeholder="请选择">
        <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id" />
      </el-select>
    </div>
    <div v-if="type" class="content-box">
      <el-table :data="currentMarkingList" style="width: 100%">
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
        <el-table-column label="姓名" prop="name" sortable />
        <el-table-column label="总分" prop="totalScore" sortable />
      </el-table>
    </div>
  </div>
</template>
<script>
const orgList = require('@/dataJson/org.json')
const userList = require('@/dataJson/user.json')
const standerdList = require('@/dataJson/standerd.json')
export default {
  name: 'AddMarking',
  components: {},
  data() {
    this.orgList = orgList
    this.userList = userList
    this.standerdList = standerdList
    return {
      type: '',
      currentMarkingList: []
    }
  },
  watch: {
    type() {
      if (this.type) {
        const currentStanderd = this.standerdList.filter(
          standerd => standerd.orgid === this.type
        )[0].standerd.map(s => {
          const standerScore = { ...s }
          standerScore.score = 0
          return standerScore
        })
        const currentUserList = this.userList.filter(
          user => user.orgid === this.type
        )
        const markingList = []
        currentUserList.forEach(user => {
          markingList.push({
            name: user.name,
            id: user.id,
            standerdScore: JSON.parse(JSON.stringify(currentStanderd)),
            totalScore: 0
          })
        })
        this.currentMarkingList = markingList
      } else {
        this.currentMarkingList = []
      }
    }
  },
  methods: {
    calcTotal(marking) {
      const totalWeight = marking.standerdScore.reduce((total, current) => {
        return total + current.weight
      }, 0)
      let totalScore = marking.standerdScore.reduce((total, current) => {
        return parseFloat(total) + (parseInt(current.score) * current.weight / totalWeight)
      }, 0)
      if ((totalScore + '').indexOf('.') > -1) {
        totalScore = totalScore.toFixed(2)
      }
      marking.totalScore = totalScore
    }
  }
}
</script>
<style scoped>
.add-marking-wrapper {
  padding: 0 20px;
}
.type-box,
.content-box {
  width: 100%;
  margin-top: 50px;
}
.score-table{
  width: 50%;
  padding: 10px;
  background-color: #ccc;
}
</style>
