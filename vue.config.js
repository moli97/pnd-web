module.exports = {

    devServer: {
        host: '0.0.0.0',
        port: 9876,
        proxy: {
            '/v1': {
                target: 'http://pan.imoli.top',  // 请求本地 拦截/rbac代理到后台项目
                // target: 'http://10.2.201:11111',  // 请求本地 拦截/rbac代理到后台项目
				ws: false
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false,
    // 部署优化
    configureWebpack: {
        // 使用CDN
        // externals: {
        //     vue: 'Vue',
        //     'vue-i18n': 'VueI18n',
        //     axios: 'axios',
        //     'vue-router': 'VueRouter',
        //     vuex: 'Vuex',
        //     iview: 'iview',
        //     echarts: 'echarts',
        //     apexcharts: 'ApexCharts',
        //     'vue-apexcharts': 'VueApexCharts',
        //     xlsx: 'XLSX',
        //     dplayer: 'DPlayer',
        //     gitalk: 'Gitalk'
        // },
        // GZIP压
    }
}
