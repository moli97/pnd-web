<template>
  <el-main>
    <el-row :gutter="20">
      <upload></upload>
    </el-row>
    <el-row :gutter="20">
      <exec></exec>
    </el-row>
  </el-main>
</template>

<script>
    import Upload from "./upload";
    import Exec from "./exec";
    export default {
        name: "dataAdmin",
        components: {Exec, Upload}
    }
</script>

<style scoped>

</style>
