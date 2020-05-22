<template>
  <el-card class="box-card">
    <el-link type="primary" icon="el-icon-folder-opened" @click="init">根目录</el-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-link type="primary" icon="el-icon-folder-opened" v-if="requestPath != '/'" @click="parentDirectory">上级目录</el-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-link type="primary" icon="el-icon-picture-outline-round" @click="onPreview" v-if="images.length>0"></el-link>

    <ul>
      <li v-for="(item,index) in fileList" :key="index">
        <el-link type="primary"
                 :icon="getIcon(item)"
                 v-if="item.displayType == 'DIRECTORY'"
                 @click="getFileList(item.path)">
          {{ item.name }}
        </el-link>
        <el-link type="primary"
                 :href="item.url"
                 target="_blank"
                 :icon="getIcon(item)"
                 v-if="item.displayType == 'FILE'">
          {{ item.name }}
        </el-link>
      </li>
    </ul>
    <el-image-viewer
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="images"/>
  </el-card>
</template>

<script>
    import {displayFile} from '@/apis/file'
    import ElImageViewer from "element-ui/packages/image/src/image-viewer";

    export default {
        name: "fileDisplay",
        components: {ElImageViewer},
        data() {
            return {
                fileList: [],
                requestPath: "/",
                images: [],
                showViewer: false,
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
                        this.filterImage();
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
            onPreview() {
                this.showViewer = this.images.length > 0;
            },
            closeViewer() {
                this.showViewer = false
            },
            filterImage() {
                this.images = [];
                this.fileList.forEach(f => {
                    if (f.fileType == "PICTURE") {
                        this.images.push(f.url)
                    }
                });
            },
            getIcon(item) {
                switch (item.fileType) {
                   case "PICTURE":
                        return "el-icon-picture-outline-round";
                    case "DEFAULT":
                        return "el-icon-folder";
                }
                return "el-icon-files";
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
