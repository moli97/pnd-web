import request from './request'

/**
 * 获取系统信息，例如：系统容量，文件数等
 */
export const systemInfo = () => {
  return request({
    url: `/v1/system`
  })
}

/** 上传到data 目录下的文件 */
export const dataUploadUrl = () => {
  return window.location.origin + '/v1/upload'
}

export const configs = () => {
  return request({
    url: '/v1/configs',
    method: 'post',
  })
}

export const scriptExec = (data) => {
  return request({
    url: '/v1/exec',
    method: 'post',
    data: data
  })
}
