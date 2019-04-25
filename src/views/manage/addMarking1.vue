<template>
  <div class="add-marking-wrapper">
    <div class="type-box">
      选择类别:
      <el-select v-model="type" placeholder="请选择">
        <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id" />
      </el-select>
    </div>
    <div v-if="type" class="content-box">
      <table>
        <th>姓名</th><th>指标</th><th>分数</th><th>总分</th>
        <template v-for="marking in currentMarkingList">
          <tr v-for="(standerd,index) in marking.standerdScore" :key="marking.name+standerd.name">
            <template v-if="index === 0">
              <td :rowspan="marking.standerdScore.length">{{ marking.name }}</td>
              <td>{{ standerd.name }}</td>
              <td><input v-model="standerd.score" width="100px" type="text"></td>
              <td :rowspan="marking.standerdScore.length">{{ marking.totalScore }}</td>
            </template>
            <template v-else>
              <td>{{ standerd.name }}</td>
              <td><input v-model="standerd.score" width="100px" type="text"></td>
            </template>
          </tr>
        </template>
      </table>
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
        )[0].standerd.map((s) => {
          const standerScore = { ...s }
          standerScore.score = Math.floor(Math.random() * 10 + 1)
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
            standerdScore: [...currentStanderd],
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
