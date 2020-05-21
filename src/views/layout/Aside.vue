<template>
  <el-menu :default-active="active" class="navbar-menu">
    <el-menu-item index="1" @click="linkToFileList">
      <i class="el-icon-document"></i>
      <span slot="title">全部文件</span>
    </el-menu-item>
    <el-menu-item index="2" @click="linkTo('/system')">
      <i class="el-icon-info"></i>
      <span slot="title">系统信息</span>
    </el-menu-item>
    <el-menu-item index="3" @click="linkTo('/admin')">
      <i class="el-icon-setting"></i>
      <span slot="title">系统管理</span>
    </el-menu-item>
    <el-menu-item index="4" @click="linkTo('/display')">
      <i class="el-icon-setting"></i>
      <span slot="title">文件显示</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Aside',
  data () {
    return {
      active: '1',
      navbar: [{
        name: 'folder',
        index: '1',
      }, {
        name: 'system',
        index: '2',
      },{
          name: 'admin',
          index: '3',
      },{
          name: 'display',
          index: '4',
      }]
    }
  },
  watch: {
    '$route' () {
      let currentPath = this.$router.currentRoute.path
      this.navbar.forEach(bar => {
        if (currentPath.indexOf(bar.name) != -1){
          this.active = bar.index
        }
      })
    }
  },
  methods: {
    linkToFileList() {
      this.$router.push('/folder/' + this.$store.state.folderId)
    },
    linkTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-menu {
  padding-top: 20px;
}
</style>
