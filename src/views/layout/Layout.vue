<template>
  <el-container class="app-container">
    <el-header height="50px">
      <Header @change="show = !show"></Header>
    </el-header>
    <el-container>
      <el-aside width="200px" v-show="show">
        <Aside></Aside>
      </el-aside>
      <el-main>
        <div class="main-container">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '@/views/layout/Header'
import Aside from '@/views/layout/Aside'
import {_isPC} from '@/utils'

export default {
  name: 'Layout',
  components: { Header, Aside },
    data() {
      return{
          show:_isPC()
      }
    },
}
</script>

<style lang="scss" scoped>
@import "src/styles/layout.scss";
</style>
