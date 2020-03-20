<template>
  <el-container class="app-container">
    <el-main>
      <span class="routerJump" @click="routerJump">返回上一级</span>
      <div class="media-container">
        <div class="header">
          <div class="media-title">
            {{ title }}
          </div>
          <div class="other">
            <el-link type="primary" @click="download">下载</el-link>
          </div>
        </div>
        <div class="media-content">
          <div id="media-player" class="media-player" v-html="internalNode"></div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import 'dplayer/dist/DPlayer.min.css';
import DPlayer from 'dplayer';
import {getFile, downloadFileUrl} from '@/apis/file'

export default {
  props: {
    fileId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false
    }
  },
  data (){
    return {
      title: '',
      mediaSrc: downloadFileUrl(this.fileId),
      dp: null,
      internalNode:''
    }
  },
  mounted () {
      this.renderMedia(this.type);
  },
  methods: {
    download () {
      let tag = document.createElement('a')
      tag.setAttribute('href', downloadFileUrl(this.fileId))
      tag.click()
    },
      renderMedia(type) {
        getFile(this.fileId).then(response => {
            this.title = response.data.fileName
            switch (type) {
                case 'video':
                    this.internalNode = ''
                    this.renderVideo();
                    break;
                case 'audio':
                    this.internalNode = `<audio src=${downloadFileUrl(this.fileId)} controls></audio>`
                    break;
                default:
                    break;
            }
        }).catch(() => {})
    },
    renderVideo() {
        this.dp = new DPlayer({
            container: document.getElementById('media-player'),
            video: {
                url: downloadFileUrl(this.fileId)
            }
        })
    },
    routerJump() {
        if (window.history.length<=2) {
            this.$router.push({path:'/'})
        }else {
            this.$router.go(-1);
        }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/layout.scss";
.media-container {
  width: 100%;
  max-width: 980px;
  height: 100%;
  margin: 0 auto;
  .header {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
  }
  .media-content {
    width: 100%;
    max-width: 980px;
    .media-player {
      width: 100%;
      max-width: 980px;
      height: auto;
    }
  }
}
.routerJump:hover {
  color: #4182f3;
}
</style>
