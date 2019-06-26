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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="editMarking(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click.stop="deleteMarking(scope.row) ">删除</el-button>
          </template>
          />
        </el-table-column></el-table>
    </div>
  </div>
</template>
<script>
import markingApi from '@/api/marking'
export default {
  name: 'ModifyMarking',
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
    this.getMarkingList()
  },
  methods: {
    getMarkingList() {
      markingApi
        .getMarking()
        .then(markingList => {
          this.markingLoading = false
          this.markingList = markingList
        })
        .catch(e => {
          this.markingLoading = false
          console.log(e)
        })
    },
    onMarkingClick(row, column, event) {
      this.$router.push({ path: '/marking/MarkingDetail/' + row._id })
    },
    editMarking(marking) {
      this.$router.push({ path: 'edit/' + marking._id })
    },
    deleteMarking(marking) {
      this.$confirm('此操作将删除该条评分, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          markingApi.deleteMarking({ _id: marking._id }).then(r => {
            this.$message.success('删除成功')
            this.markingLoading = true
            this.getMarkingList()
          })
        })
        .catch((e) => {
          this.markingLoading = false
          console.log(e)
        })
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
