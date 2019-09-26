// import { template } from "handlebars";

$(function () {
  // 注意  要进行本地存储localStorage的操作 进行历史记录管理
  //  需要约定一个健名  search_list
  // 将来通过search_list 进行读取或者设置操作


  // 准备假数据：将下面三行代码  在控制台执行可以添加假数据
  //  var arr = ["斗罗大陆","大口大口","的领略到","的可靠的","渐渐地就","的宽度","零度可乐","王久"];
  //  var jsonStr = JSON.stringify(arr);
  //  localStorage.setItem("search_list",jsonStr);


  // 功能1  列表渲染功能
  // 1 从本地存储中读取历史记录 读取的是jsonStr
  // 2 转换成数组
  // 3通过模板引擎动态渲染
  render();
  //  从本地存储中读取历史数据
  function getHistory() {
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);
    // console.log(arr);
    return arr;
  }
  // 读取数组 进行页面渲染
  function render() {
    var arr = getHistory();
    // template(模板id， 数据对象)
    var htmlStr = template("historyTpl", { arr: arr });
    $(".lt_history").html(htmlStr);

  }

  // 功能2 情况历史记录功能
  //  1 注册事件 通过事件问题委托注册
  //  2 情况历史记录 removeItem
  //  3 页面重新渲染
  $(".lt_history").on("click", ".btn_empty", function () {

    //  添加MUI确认框
    //  参数1 对话框内容 message
    //  参数2 对话框标题 title
    //  参数3 按钮文本数组 brnArr 
    //  参数4  回调函数 callback
    mui.confirm("你确定要清空记录吧？", "温馨提示", ["取消", "确认"], function (e) {
      //  e.index 可以获取所有点击按钮的索引
      if (e.index === 1) {
        // 情况历史记录
        localStorage.removeItem("search_list");
        // 重新渲染
        render();
      }
    })

  });

  //   功能3 删除单条记录
  //  1 注册事件 通过事件委托
  //  2 将下标存在删除按钮上 获取存储的下标
  //  3 从本地存储中读取数据
  //  4 通过下标从数组中 删除对应项  splice
  //  5 将修改后的数组  转成jsonStr  存到本地存储中
  //  6 页面重新渲染

  $('.lt_history').on("click", ".btn_del", function () {

    var that = this;
    // 添加确认按钮
    mui.confirm("你确定要删除该条记录吧吧？", "温馨提示", ["取消", "确认"], function(e){

      // 获取下标
      var index = $(that).data("index");
      // 获取数组
      var arr = getHistory();
      // splice（从哪开始 删除几项，添加项，）
      // 根据下标 删除数组的对应项   根据索引 删除数组的项
      arr.splice(index, 1);
  
      // 转成jsonStr 存到本地中
      localStorage.setItem("search_list", JSON.stringify(arr));
      // 页面重新渲染
      render();
    })
  });

  // 功能4 添加历史记录功能
  //  1 给搜索按钮 添加点击事件
  //  2 获取输入框的值 
  //  3获取本地历史中存的的数组
  //  4 往数组的最前面追加
  //  5 转成jsonStr字符串 将修改后的存储到本地中
  //  6 页面重新渲染
  // 
  $(".search_btn").click(function(){
    // 获取关键字 trim 函数用于去除字符串两端的空白字符
    var key = $(".search_input").val().trim();
    // 获取数组
    var arr = getHistory();

    // 需求
    //  1 如果有重复的 先将重复的删除 将将这项添加到最前面
    //  2 长度不能超过10
    var index = arr.indexOf(key);
    if(index != -1){
      // 说明数组可以找到重复的项  且索引为index
      arr.splice(index,1);
    }
    if (arr.length >= 10){
      // 删除最后一项
      arr.pop();
    }
    // 往数组最前面追加
    arr.unshift(key);
    // 转成json  存到本地存储中 
    localStorage.setItem("search_list",JSON.stringify(arr));
    // 页面重新渲染
    render();

    // 清空输入框
    $(".search_input").val("");
  })

});