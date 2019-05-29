<template>
  <el-table :data="marking" row-class-name="pointer" style="width: 100%" row-key="name" :expand-row-keys="expandRowKeys" @row-click="rowClick">
    <el-table-column type="expand">
      <div slot-scope="props" class="score-table">
        <el-table :data="props.row.standerdScore" style="width: 100%">
          <el-table-column label="标准" prop="name" />
          <el-table-column label="权重" prop="weight" />
          <el-table-column label="评分" prop="score" />
        </el-table>
      </div>
    </el-table-column>
    <el-table-column label="姓名" prop="name" sortable />
    <el-table-column label="总分" prop="totalScore" sortable />
  </el-table>
</template>
<script>
import markingApi from '@/api/marking'
export default {
  name: 'MarkingDetail',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      marking: [],
      expandRowKeys: []
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getMarkingData()
  },
  methods: {
    getMarkingData() {
      markingApi.getMarking({ _id: this.id }).then(marking => {
        this.marking = marking[0].marking
      }).catch(e => { console.log(e) })
    },
    rowClick(row, event, column) {
      if (this.expandRowKeys.includes(row.name)) {
        this.expandRowKeys.splice(this.expandRowKeys.indexOf(row.name), 1)
      } else {
        this.expandRowKeys.push(row.name)
      }
    },
    expandAll() {
      const allKeys = []
      this.currentMarkingList.forEach(marking => {
        allKeys.push(marking.name)
      })
      this.expandRowKeys = allKeys
    },
    unexpandAll() {
      this.expandRowKeys = []
    }
  }
}
</script>
<style scoped>
.score-table {
  width: 50%;
  padding: 10px;
  background-color: #ccc;
}
</style>
