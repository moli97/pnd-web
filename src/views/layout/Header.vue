<template>
  <div class="header-container">
    <i v-if="asideVisiable" class="el-icon-s-fold icon"></i>
    <router-link to="/"><span class="name">个人网盘</span></router-link>
    <div style="margin-left: auto" @click="logout">
      <el-avatar :size="30" :src="require('@/assets/user.jpeg')"></el-avatar>
    </div>
  </div>
</template>

<script>
    import {logout} from '@/apis/token'
    export default {
      props: {
          asideVisiable: {
          type: Boolean,
          default: true
        }
      },
      methods:{
        logout(){
            this.$confirm('确定注销?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                logout().then(res=>{
                  if (res){
                    localStorage.setItem("accessToken","");
                    this.$router.push("/login")
                  }
                })
            }).catch(() => {
                localStorage.setItem("accessToken","");
                this.$router.push("/login")
            });
        }
      }
    }
</script>

<style lang="scss" scoped>
@import "src/styles/index.scss";
.header-container {
  width: 96%;
  margin: 0 auto;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  .icon {
    font-size: 30px;
    cursor: pointer;
  }
  .name {
    padding-left: 6px;
  }
  .el-avatar {
    margin-left: auto;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
  }
  a {
    @include linkTo;
  }
}
</style>
