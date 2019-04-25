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
          <template slot-scope="props">
            <el-table :data="props.row.standerdScore" style="width: 50%">
              <el-table-column label="标准" prop="name" />
              <el-table-column label="权重" prop="weight" />
              <el-table-column label="评分" prop="score">
                <template slot-scope="stand">
                  <el-input v-model="stand.row.score" @change="calcTotal(props.row.name)" />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="总分" prop="totalScore" />
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
            standerdScore: currentStanderd,
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
    calcTotal(name) {
      for (let i = 0; i < this.currentMarkingList.length; i++) {
        if (this.currentMarkingList[i].name === name) {
          const marking = this.currentMarkingList[i]
          marking.totalScore = marking.standerdScore.reduce((total, current) => {
            return total + parseInt(current.score) * current.weight
          }, 0)
        }
      }
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
</style>
