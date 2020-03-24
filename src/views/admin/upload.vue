<template>
  <div>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <el-upload
            class="upload-demo"
            ref="upload"
            :action="action"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            multiple
            drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

  </div>
</template>

<script>
    import { dataUploadUrl } from '@/apis/system'
    export default {
        name: "upload",
        data() {
            return {
                action: dataUploadUrl(),
                headers: {accessToken: localStorage.getItem("accessToken")},
                fileList: []
            };
        },
        methods: {
            submitUpload() {
                this.action = dataUploadUrl();
                this.headers.accessToken = localStorage.getItem("accessToken");
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                // eslint-disable-next-line no-console
                console.log(file, fileList);
            },
            handlePreview(file) {
                // eslint-disable-next-line no-console
                console.log(file);
            }
        }
    }
</script>

<style scoped>

</style>
