<template>
  <div class="com-container" @dblclick="revertMap">
      <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
    data(){
        return{
            chartInstance: null,
            allData: null,
            mapData:{} //所获取的省份的地图矢量数据
        }
    },
    mounted(){
        this.initChart()
        this.getData()
        window.addEventListener('resize', this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize', this.screenAdapter)
    },
    methods:{
        async initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk')
            const ret = await axios.get('http://localhost:8080/static/map/china.json')
            this.$echarts.registerMap('china', ret.data)
            const initOption = {
                title:{
                    text: '▎商家分布',
                    left:20,
                    top:20
                },
                geo:{
                    type: 'map',
                    map: 'china',
                    top: '5%',
                    bottom: '5%',
                    itemStyle:{
                        areaColor:'#2E72BF',
                        borderColor:'#333'
                    }
                },
                legend:{
                    left:'5%',
                    bottom:'5%',
                    orient:'vertical'
                }
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('click', async arg =>{
                // arg.name 得到所点击的省份, 这个省份他是中文
                const provinceInfo = getProvinceMapInfo(arg.name)
                console.log(provinceInfo)
                // 需要获取这个省份的地图矢量数据
                // 判断当前所点击的这个省份的地图矢量数据在mapData中是否存在
                if (!this.mapData[provinceInfo.key]) {
                    const ret = await axios.get('http://localhost:8080' + provinceInfo.path)
                    console.log(ret)
                    this.mapData[provinceInfo.key] = ret.data
                    this.$echarts.registerMap(provinceInfo.key, ret.data)
                }
                const changeOption = {
                    geo: {
                        map: provinceInfo.key
                    }
                }
                this.chartInstance.setOption(changeOption)
            })
        },
        async getData(){
            const {data: ret} = await this.$http.get('map')
            this.allData = ret
            console.log(ret)
            this.updateChart()
        },
        updateChart(){
            const legendArr = this.allData.map(item=>{
                return item.name
            })
            const seriesArr = this.allData.map(item =>{
                return {
                    type: 'effectScatter',
                    rippleEffect:{
                        scale: 5,
                        brushType: 'stroke'
                    },
                    name: item.name,
                    data:item.children,
                    coordinateSystem: 'geo'
                }
            })
            const dataOption = {
                legend: {
                    data: legendArr
                },
                series: seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                title:{
                    textStyle:{
                        fontSize: titleFontSize
                    }
                },
                legend:{
                    itemWidth:titleFontSize /2,
                    itemHeight:titleFontSize /2,
                    itemGap:titleFontSize /2,
                    textStyle:{
                        fontSize:titleFontSize /2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()//自动计算外层容器从而控制自身图表大小
        },
        // 回到中国地图
        revertMap () {
        const revertOption = {
            geo: {
            map: 'china'
            }
        }
        this.chartInstance.setOption(revertOption)
        }
    }
}
</script>

<style>

</style>