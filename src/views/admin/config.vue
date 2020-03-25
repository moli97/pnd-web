<template>
  <div>
    <el-table
            :data="configs"
            style="width: 100%"
            height="100%">
      <el-table-column
              type="selection"
              show-overflow-tooltip
              min-width="2">
      </el-table-column>
      <el-table-column
              prop="confKey"
              label="配置键"
              sortable
              show-overflow-tooltip
              min-width="33">
        <template slot-scope="scope">
            {{ scope.row.confKey }}
        </template>
      </el-table-column>
      <el-table-column
              prop="confValue"
              label="配置值"
              sortable
              show-overflow-tooltip
              min-width="33">
        <template slot-scope="scope">
          {{ scope.row.confValue }}
        </template>
      </el-table-column>
      <el-table-column
              prop="descInfo"
              label="描述"
              sortable
              show-overflow-tooltip
              min-width="33">
        <template slot-scope="scope">
          {{ scope.row.descInfo }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {configs} from '@/apis/system'
    export default {
        name: "config",
        data() {
            return{
                configs:[],
            }
        },
        mounted() {
            configs().then(res=>{
                this.configs = res.data;
            })
        }
    }
</script>

<style scoped>

</style>
