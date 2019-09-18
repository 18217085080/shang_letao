/**
 * Created by user on 2019/9/17.
 */
$(function(){
    // 基于准备好的dom，初始化echarts实例
    var echarts1 = echarts.init(document.querySelector('.echarts_1'));

    // 指定图表的配置项和数据
    var option1 = {
        //大标题
        title: {
            text: '商城注册人数'
        },
        //提示框组件
        tooltip: {},
        //图例
        legend: {
            data:['人数']
        },
        // X轴的可读
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        // Y轴的刻度 一般不设置 根据动态生成
        yAxis: {},
        //数据项列表
        series: [{
            name: '人数',
            // bar 柱状图  line 折线图 pie 饼图
            type: 'bar',
            data: [1000,1900,1400,1600,1800,1400,2000]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts1.setOption(option1);


    // 基于准备好的dom，初始化echarts实例
    var echarts2 = echarts.init(document.querySelector('.echarts_2'));

    // 指定图表的配置项和数据
    var option2 = {

        title : {
            text: '热门品牌销售',
            // 副标题
            subtext: '2019年8月',
            //控制标题的位置居中
            x:'center'
        },
        // 提示框组件
        tooltip : {
            // 配置提示信息
            trigger: 'item',
            //  axis  坐标轴触发
            //trigger: 'axis',
            // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //图例
        legend: {
            orient: 'vertical',
            left: 'left',
            //left: 'right',
            data: ['小米','华为','联想','苹果','三星']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                // 指定园的大小 直径所占比例
                radius : '55%',
                // 圆心坐标的位置
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'小米'},
                    {value:310, name:'华为'},
                    {value:234, name:'联想'},
                    {value:135, name:'苹果'},
                    {value:1548, name:'三星'}
                ],
                // 可以添加阴影效果
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts2.setOption(option2);
});