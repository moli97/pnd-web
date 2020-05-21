<template>
  <el-card class="box-card">
    <el-link type="primary" icon="el-icon-folder" @click="init">根目录</el-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-link type="primary" v-if="requestPath != '/'" @click="parentDirectory">上级目录</el-link>
    <ul>
      <li v-for="(item,index) in fileList" :key="index">
        <el-link type="primary" icon="el-icon-files" v-if="item.displayType == 'DIRECTORY'" @click="getFileList(item.path)">{{ item.name }}</el-link>
        <el-link type="primary" :href="item.url" target="_blank" v-if="item.displayType == 'FILE'">{{ item.name }}</el-link>
      </li>
    </ul>
  </el-card>
</template>

<script>
    import {displayFile} from '@/apis/file'

    export default {
        name: "fileDisplay",
        data() {
            return {
                fileList: [],
                requestPath: "/"
            }
        },
        methods: {
            init() {
                this.getFileList("/")
            },
            getFileList(path) {
                this.requestPath = path;
                displayFile({"path": this.requestPath}).then(res => {
                    if (res.msg == "success") {
                        this.fileList = res.data;
                    }
                })
            },
            parentDirectory() {
                let number = this.requestPath.lastIndexOf("/");
                if (number <= 0) {
                    this.init();
                    return
                }
                this.getFileList(this.requestPath.substring(0, number));
            },
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
