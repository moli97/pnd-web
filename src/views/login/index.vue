<template>
  <body id="poster">
    <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox>
      <el-button type="primary" style="width: 100%;background: #098dff;border: none" v-on:click="login">登&nbsp;录</el-button>
    </el-form-item>
  </el-form>
  </body>
</template>


<script>
    import {login} from '@/apis/token'
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                checked: false,
            }
        },
        methods: {
            login() {
                login(this.loginForm).then(res=>{
                    localStorage.setItem("accessToken",res.data);
                    localStorage.setItem("username",this.loginForm.username);
                    localStorage.setItem("checked",this.checked);
                    if (this.checked){
                        localStorage.setItem("password",this.loginForm.password);
                    } else {
                        localStorage.setItem("password",'');
                    }
                    this.$router.push({path: '/'});
                }).catch(() => {
                    this.loginForm.password = '';
                    this.$alert('用户名或密码错误', '', {
                        confirmButtonText: 'ok'
                    })
                })
            }
        },
        mounted() {
            this.checked = localStorage.getItem("checked") == 'true';
            this.loginForm.username = localStorage.getItem("username");
            if (this.checked){
                this.loginForm.password = localStorage.getItem("password");
            }
            if (localStorage.getItem("accessToken")) {
                this.$router.push({path: '/'})
            }
        }
    }
 </script>

<style>
  #poster {
    background:url("../../assets/nightscape2.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0;
  }

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    /*background: #fff;*/
    /*border: 1px solid #eaeaea;*/
    box-shadow: 0 0 25px #cac6c6;
    /*opacity:0.5;*/
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #f3fff2;
  }
</style>
