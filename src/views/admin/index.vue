<template>
  <div>
    <upload></upload>
    <exec></exec>
  </div>
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
