<template>
  <div class="marking-wrapper">
    <div class="serch-wrapper clearfix">
      <el-date-picker v-model="timeSpan" class="fr" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" />
      <el-input v-model="titleKey" class="serch-box fr" placeholder="输入关键字查询" clearable />
    </div>
    <div class="marking-list">
      <el-table v-loading="markingLoading" :data="markingList" style="width: 100%" :default-sort="{prop: 'title', order: 'descending'}" @row-click="onMarkingClick">
        <el-table-column prop="title" label="标题" sortable />
        <el-table-column prop="addDate" label="评分时间" sortable />
        <el-table-column prop="updateDate" label="更新时间" sortable />
      </el-table>
    </div>
  </div>
</template>
<script>
import markingApi from '@/api/marking'
export default {
  name: 'Marking',
  components: {},
  props: [],
  data() {
    return {
      titleKey: '',
      timeSpan: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      markingList: [],
      markingLoading: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    markingApi
      .getMarking()
      .then(markingList => {
        this.markingLoading = false
        this.markingList = markingList
      })
      .catch(e => {
        console.log(e)
      })
  },
  methods: {
    onMarkingClick(row, column, event) {
      this.$router.push({ path: 'MarkingDetail/' + row._id })
    }
  }
}
</script>
<style lang="scss" scoped>
.marking-wrapper {
  padding: 30px 10px;
}
.serch-box {
  width: 200px;
  margin: 0 10px;
}
.marking-list {
  margin-top: 20px;
  box-shadow: 0 0 5px 1px #ccc;
}
</style>
