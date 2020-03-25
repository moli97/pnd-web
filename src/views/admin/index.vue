<template>
  <el-main style="margin: auto">
    <el-row :gutter="20">
      <upload></upload>
    </el-row>
    <el-row :gutter="20">
      <config></config>
    </el-row>
  </el-main>
</template>

<script>
    import Upload from "./upload";
    import Config from "./config";

    export default {
        name: "dataAdmin",
        components: {Config, Upload}
    }
</script>

<style scoped>

</style>
