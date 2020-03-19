<template>
  <div class="file-list-container">
    <div class="operater">
      <el-button type="primary" icon="el-icon-upload" @click="uploadFileTrigger">上传文件</el-button>
      <el-button icon="el-icon-folder-add" plain @click="createFolder">新增文件夹</el-button>
      <el-button-group class="extend-btn">
        <el-button icon="el-icon-edit" v-if="selection.length === 1" @click="renameFile(selection[0])" plain>重命名</el-button>
        <el-button icon="el-icon-download" v-if="canDownload()" @click="downloadFiles(selection)" plain>下载</el-button>
        <el-button icon="el-icon-delete" v-if="selection.length > 0" plain @click="deleteFiles(selection)">删除</el-button>
        <el-button plain v-if="selection.length > 0" @click="moveTo(selection)">移动到</el-button>
        <el-button plain v-if="selection.length > 0" @click="copyTo(selection)">复制到</el-button>
      </el-button-group>
    </div>
    <div class="navigation">
      <div class="previous-level" v-if="navigation.length > 1">
        <router-link :to="'/folder/' + navigation[navigation.length - 2].id">
          <span>返回上一级</span>
        </router-link>
        <span class="navigation-separator">|</span>
      </div>
      <div class="breadcrumb">
        <div class="breadcrumb-item" v-for="(nav, index) in navigation" :key="'navigation-' + index">
          <router-link :to="'/folder/' + nav.id">
            <span class="breadcrumb-name">{{ nav.fileName }}</span>
          </router-link>
          <span class="navigation-separator" v-if="index !== navigation.length - 1">/</span>
        </div>
      </div>
    </div>
    <div class="file-list">
      <el-table
        :data="fileList"
        style="width: 100%"
        height="100%"
        :default-sort = "{prop: 'fileName', order: 'ascending'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          show-overflow-tooltip
          min-width="2">
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名"
          sortable
          show-overflow-tooltip
          min-width="33">
          <template slot-scope="scope">
            <router-link class="file-name" to @click.native="fileHandle(scope.row)">
              <span class="file-icon" :class="getFileType(scope.row.type)"></span>
              {{ scope.row.fileName }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="大小"
          sortable
          :formatter="sizeFormatter"
          min-width="12">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改日期"
          sortable
          show-overflow-tooltip
          :formatter="dateFormatter"
          min-width="22">
        </el-table-column>
        <el-table-column
          min-width="15"
          label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <span>
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
<!--                <el-dropdown-item v-if="getFileType(scope.row.type) === 'picture'" @click.native="preview(scope.row)">查看</el-dropdown-item>-->
                <el-dropdown-item @click.native="moveTo([scope.row])">移动到</el-dropdown-item>
                <el-dropdown-item @click.native="copyTo([scope.row])">复制到</el-dropdown-item>
                <el-dropdown-item @click.native="renameFile(scope.row)">重命名</el-dropdown-item>
                <el-dropdown-item @click.native="downloadFiles([scope.row])" v-if="getFileType(scope.row.type) != 'folder'">下载</el-dropdown-item>
                <el-dropdown-item @click.native="deleteFiles([scope.row])">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog :title="filePreview.title" :visible.sync="filePreview.show" width="100%" style="max-width: 500px;margin: auto;">
        <el-button v-if="filePreview.rawType == 'web'" @click="webOutputFormat" size="mini" style="position: relative; left: 4px">change</el-button>
        <div>
          <img v-if="filePreview.type == 'picture'" :src="filePreview.url" width="100%" style="max-width: 450px">
          <pre v-else-if="filePreview.type == 'code' || filePreview.type == 'txt'">{{filePreview.code}}</pre>
          <div v-else-if="filePreview.type == 'web'" v-append="filePreview.code" @appended="appended"></div>
        </div>
      </el-dialog>
    </div>
    <FolderTreeDialog v-if="folderTreeVisiable" v-bind="folderTreeProps"
      v-on:return="dealReturn"/>
  </div>
</template>

<script>
import {getFileList, createFile, renameFile, deleteFiles, moveOrCopyFiles, downloadFileUrl,downloadFile} from '@/apis/file'
import {formatSize, formatDateTime} from '@/utils'
import FolderTreeDialog from '@/components/FolderTreeDialog'

export default {
  name: 'FileList',
  components: {
    FolderTreeDialog
  },
  props: ['folderId'],
  data() {
    return {
      folderTreeVisiable: false,
      folderTreeProps: {
        type: 'move', // 标示操作类型，move和copy
        title: '提示',
        sourceFiles: []
      },
      fileList: [],
      navigation: [],
      selection: [],
      filePreview:{
        title:'',
        show: false,
        url:'',
        type: '',
        code: '',
        rawType: '',
      },
      supportedType:['default', 'folder', 'pdf', 'compress_file', "web", 'video', 'audio', 'picture', 'doc', 'txt', 'torrent', 'ppt', 'code', 'excel'],
    }
  },
  watch: {
    folderId () {
      this.$store.commit('changeFolderId', this.folderId)
      this.renderFileList()
    }
  },
  methods: {
    appended() {
        // eslint-disable-next-line no-console
        console.log('appended!');
    },
    uploadFileTrigger () {
      window.eventBus.$emit('openUploader')
    },
    renderFileList () {
      getFileList(this.folderId).then(response => {
        this.fileList = response.data
        this.navigation = response.extra
      }).catch(() => {})
    },
    createFolder () {
      this.$prompt('请输入文件夹名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,100}$/,
        inputErrorMessage: '文件夹名长度必须小于100'
      }).then(({ value }) => {
        createFile(this.folderId, value, 'folder').then(() => {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.renderFileList()
        }).catch(error => {
          if (error.data) {
            this.$message({
              type: 'error',
              message: error.data.msg
            })
          }
        })
      }).catch(() => {});
    },
    fileHandle (row) {
      switch (this.getFileType(row.type)) {
          case 'picture':
              this.imgPreview(row);
              break;
          case 'video':
          case 'audio':
              this.$router.push(`/media/${row.id}`);
              break;
          case 'folder':
              this.$router.push(`/folder/${row.id}`);
              break;
          case 'code':
          case 'txt':
              this.codePreview(row);
              break;
          case 'web':
              this.codePreview(row);
              break;
          case 'pdf':
              // eslint-disable-next-line no-console
              console.log(`http://view.xdocin.com/xdoc?_xdoc=${downloadFileUrl(row.id)}`)
              // eslint-disable-next-line no-console
              console.log(`/pdf/web/viewer.html?file=${downloadFileUrl(row.id)}`)
              this.pdfPreview(row);
              break;
          case 'doc':
              alert(downloadFileUrl(row.id))
              break;
          default:
      }
    },
    commonHandle(row) {
        this.filePreview.show = true;
        this.filePreview.type = row.type;
        this.filePreview.title = row.fileName;
        this.filePreview.rawType = row.type;
    },
    codePreview (row) {
        this.commonHandle(row);
        downloadFile(row.id).then(res=>{
            this.filePreview.code = res;
        }).catch(()=>{
            this.filePreview.show = false;
        })
     },
    imgPreview (row) {
        this.commonHandle(row);
        this.filePreview.url = downloadFileUrl(row.id);
    },
    pdfPreview (row) {
        let routeUrl = this.$router.resolve({
            path: "/pdf/web/viewer.html",
            query: {file:downloadFileUrl(row.id)}
        });
        window.open(routeUrl.href, '_blank');
    },
    outputFormat(type) {
        this.filePreview.type = type;
    },
    webOutputFormat() {
        switch (this.filePreview.type) {
            case "web":
                this.outputFormat("code");
                break;
            case "code":
                this.outputFormat("web");
                break;
            default:
        }
    },
    renameFile (row) {
      this.$prompt('请输入文件夹名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,100}$/,
        inputValue: row.fileName,
        inputErrorMessage: '文件夹名长度必须小于100'
      }).then(({ value }) => {
        renameFile(row.id, value).then(() => {
          this.$message({
            type: 'success',
            message: '文件重命名成功'
          })
          this.renderFileList()
        }).catch(error => {
          if (error.data) {
            this.$message({
              type: 'error',
              message: error.data.msg
            })
          }
        })
      }).catch(() => {})
    },
    deleteFiles (arr) {
      let ids = new Array()
      for (let i = 0; i < arr.length; i++) {
        ids.push(arr[i].id)
      }
      this.$confirm('确定删除文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFiles(ids).then(() => {
          this.$message({
            type: 'success',
            message: '文件删除成功'
          })
          this.renderFileList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '文件删除失败'
          })
          this.renderFileList()
        })
      }).catch(() => {});
    },
    moveTo (arr) {
      this.folderTreeProps = {
        type: 'move',
        title: '移动到',
        sourceFiles: arr
      }
      this.$nextTick(() => {
        this.folderTreeVisiable = true
      })
    },
    copyTo (arr) {
      this.folderTreeProps = {
        type: 'copy',
        title: '复制到',
        sourceFiles: arr
      }
      this.$nextTick(() => {
        this.folderTreeVisiable = true
      })
    },
    dealReturn (val) {
      if (val.type === 'cancel') {
        this.folderTreeVisiable = false
        return
      } else {
        let arr = val.value, that = this,
            sourceIds = this.folderTreeProps.sourceFiles.map(f => f.id)
        let operate = function (sourceIds, targetIds, type, successCallback) {
          moveOrCopyFiles(sourceIds, targetIds, type).then(() => {
            successCallback()
            that.folderTreeVisiable = false
            that.renderFileList()
          }).catch(() => {})
        }
        if (this.folderTreeProps.type === 'move') { // 移动文件到
          if (arr.length !== 1) {
            this.$message({
              type: 'error',
              message: '必须选择一个目标文件夹'
            })
          } else {
            operate(sourceIds, arr, 'move', () => {
              that.$message({
                type: 'success',
                message: '移动文件成功'
              })
            })
          }
        } else if (this.folderTreeProps.type === 'copy') { // 复制文件到
          if (arr.length !== 1) {
            this.$message({
              type: 'error',
              message: '请选择文件夹'
            })
          } else {
            operate(sourceIds, arr, 'copy', () => {
              that.$message({
                type: 'success',
                message: '复制文件成功'
              })
            })
          }
        }
      }
    },
    handleSelectionChange(val) {
      this.selection = val
    },
    canDownload () {
      let hasFolder = false
      for (let i = 0; i < this.selection.length; i++) {
        if (this.selection[i].type === 'folder') {
          hasFolder = true
          break
        }
      }
      return !hasFolder && this.selection.length > 0
    },
    downloadFiles (arr = []) {
      function download(url) {
        let tag = document.createElement('a')
        tag.setAttribute('href', url)
        tag.click()
      }
      let i = 0
      if (i < arr.length) {
        download(downloadFileUrl(arr[i].id))
        i++
      }
      let s = setInterval(() => {
            if (i < arr.length) {
              download(downloadFileUrl(arr[i].id))
              i++
            } else {
              clearInterval(s)
            }
          }, 2000);
    },
    getFileType (originType){
      if (this.supportedType.indexOf(originType) !== -1){
        return originType
      }
      return 'default'
    },
    sizeFormatter (row) {
      let size = formatSize(row.size, 2)
      if (row.type === 'folder' || size === undefined) {
        return '-'
      }
      return size
    },
    dateFormatter(row) {
      return formatDateTime(row.updateTime)
    }
  },
  mounted () {
    let that = this
    this.renderFileList()
    window.eventBus.$on('flushFileList', query => {
      this.params = query || {};
      that.renderFileList()
    })
  },
  destroyed () {
    window.eventBus.$off('flushFileList')
  }
}
</script>

<style lang="scss" scoped>
.file-list-container {
  height: 100%;
  position: relative;
  a {
    color: #000;
    text-decoration: none;
    &:visited {
      color: #000;
    }
    &:hover {
      color: #3794ff;
    }
  }
  .extend-btn {
    margin-left: 30px;
  }
  .navigation {
    font-size: 14px;
    font-weight: 500;
    margin: 10px 0px;
    .previous-level {
      cursor: pointer;
      display: inline-block;
      span:first-child:hover {
        color: #3794ff;
      }
    }
    .breadcrumb, .breadcrumb-item {
      display: inline-block;
      .breadcrumb-name {
        cursor: pointer;
        &:hover {
          color: #3794ff;
        }
      }
    }
    .navigation-separator {
      padding: 0 5px;
    }
  }
  .file-list {
    width: 100%;
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
  }
}
.el-icon-more{
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: #3794ff;
  }
}
.file-icon{
  display: inline-block;
  background-image: url(../../assets/file_icons.png);
  background-repeat: no-repeat;
  width: 26px;
  height: 23px;
}
.file-name{
  display: inline-block;
  padding-left: 8px;
  text-decoration: none;
  color: #000;
  cursor: pointer;
}
.default{
  background-position: -596px -566px;
}
.folder{
  background-position: -594px -862px;
}
.pdf{
  background-position: -596px -136px;
}
.compress_file{
  background-position: -596px -1664px;
}
.video{
  background-position: -596px -1630px;
}
.audio{
  background-position: -596px -442px;
}
.picture{
  background-position: -596px -306px;
}
.doc {
  background-position: -596px -170px;
}
.txt {
  background-position: -596px -102px;
}
.ppt {
  background-position: -596px -204px;
}
.torrent {
  background-position: -596px 0px;
}
.web{
  background-position: -594px -1458px;
}
.code {
  background-position: -596px -1424px;
}
.excel {
  background-position: -596px -240px;
}
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
  white-space:pre-wrap;
  word-wrap:break-word;
}
</style>
