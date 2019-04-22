<template>
  <div class="add-marking-wrapper">
    <div class="type-box">
      选择类别:
      <el-select v-model="type" placeholder="请选择">
        <el-option
          v-for="org in orgList"
          :key="org.id"
          :label="org.name"
          :value="org.id"
        />
      </el-select>
    </div>
    <div v-if="type" class="content-box">
      <el-table
        :data="currentMarkingList"
        :span-method="arraySpanMethod"
        border
        class="marking-table"
      >
        <el-table-column
          prop="username"
          label="姓名"
        />
        <el-table-column
          prop="standerd"
          label="项目"
        />
        <el-table-column
          prop="weight"
          sortable
          label="权重"
        />
        <el-table-column
          prop="marking"
          sortable
          label="评分"
        />
        <el-table-column
          prop="total"
          sortable
          label="总分"
        />
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
      type: ''
    }
  },
  computed: {
    currentStanderd() {
      return this.standerdList.filter(
        standerd => standerd.orgid === this.type
      )[0].standerd
    },
    currentMarkingList() {
      const markingList = []
      this.userList.forEach(user => {
        this.currentStanderd.forEach(standerd => {
          markingList.push({
            username: user.name,
            standerd: standerd.name,
            weight: standerd.weight,
            marking: 0,
            total: 0
          })
        })
      })
      console.log(markingList)
      return markingList
    }
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const rowspanLengh = this.currentStanderd.length
      if (columnIndex === 0) {
        if (rowIndex % rowspanLengh === 0) {
          return [rowspanLengh, 1]
        } else {
          return [0, 0]
        }
      } else if (columnIndex === 4) {
        if (rowIndex % rowspanLengh === 0) {
          return [rowspanLengh, 1]
        } else {
          return [0, 0]
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
.marking-table{
  width: 100%;
  margin-top: 50px;
}
</style>
