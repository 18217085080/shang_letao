// import { template } from "handlebars";

$(function (){
   var currentPage = 1 ; //当前页
   var pageSize = 2 ;   //每页多少条

  //  整个页面核心方法 render
  //  在render方法中 处理所有参数
  function render( callback) {
    // $('.lt_product').html('<div class="loading"></div>');
    var params = {};
    //  1 上毕传参数
    params.proName = $(".search_input").val();
    params.page = currentPage;
    params.pageSize = pageSize;
    // 2 两个可传不可传的参数
    //  1需要根据高亮  a 来判断传那个参数 
    //  2通过箭头判断  升序还是降序
    //   价格 price     1 升序 2 降序
    //   库存 num     1 升序 2 降序

    var $current = $('.lt_sort a.current');
    if ($current.length > 0) {
      // 有高亮的a  说明需要进行排序
      // 获取传给后台的健
      var sortName = $current.data("type");
      // 获取传递给后台的值  通过箭头方向判断
      var sortValue = $current.find("i").hasClass(" fa-angle-down") ? 2 : 1;
      // 添加到params 中
      params[sortName] = sortValue;
    }
    setTimeout(function () {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        success: function (info) {
          console.log(info);
          
          callback  && callback(info);  //如果callback存在在进行调用
        }
      })
    }, 500);

  }
  // 功能1 获取地址栏中参数赋值给 input
  var key = getSearch("key");
  $(".search_input").val(key);

  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        // 配置一进入页面 就自动刷新一次
        auto:true,
        callback :function(){    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
           console.log("发送ajax请求 进行页面渲染"); 
        
          //  加载第一页
          currentPage = 1;
           render(function(info){
            var htmlStr = template("proudectTpl", info);
            $(".lt_product").html(htmlStr);
              //  ajax请求回来之后  需要结束下拉刷新  让内容
              // 注意  api 做了更新 mui文档上还没更新上小坑  需要打印   在原型上 找到以下  方法才能更新
            //  endPulldownToRefresh
            //  console.log(mui(".mui-scroll-wrapper").pullRefresh()  );
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh() ;
            // 第一页数据被重新加载之后  又有数据可以进行上拉加载 需要重新启用
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
           });
        }
      },
      // 配置上啦加载
      up:{
        callback:function(){
          console.log("上啦加载了");
          currentPage++;
          render(function(info){
            var htmlStr = template("proudectTpl", info);
            $(".lt_product").append(htmlStr);   //在原有的基础上进行追加
              // 当数据回来结束  需要结束上拉加载
              //   通过pullRefresh这个方法创建实例
              // endPullupToRefresh（boolean） 传布尔值 结束上拉加载
              //  1 如果传true 没有更多数据 会显示提示语句 会自动禁用上拉加载防止发生无效ajax
              //  2 如果传false 还有更多数据
              if(info.data.length === 0){
                // 没有更多数据了  显示提示语句
                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
              }
              else{
                // 还有数据  正常结束上拉加载
                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                
              }
          });
        }
      }
    }
  });

  // render();
  // 功能2 点击按钮 实现搜索功能
  $(".search_btn").click(function () {
    var key = $('.search_input').val();// 获取搜索关键字
    if (key.trim() === "") {
      mui.toast("请输入搜索关键字");
      return;
    }
    // render(); 不需要调用
    // 执行一次下拉刷新即可 在下拉刷新回调中 会进行页面渲染
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading(); //点击按钮  让下拉框执行一次

    // 有搜索内容  需要添加到本地存储中
    var histiry = localStorage.getItem("search_list") || '[]';  //得到是jsonstr
    var arr = JSON.parse(histiry); //转成数组
    // 需求
    //  1 不能重复
    var index = arr.indexOf(key);
    if (index != -1) {
      // 删除对应重复项
      arr.splice(index, 1);
    }

    //  2 不能超过10 个

    if (arr.length >= 10) {
      // 删除最后一项
      arr.pop();
    }
    // 往数组最前面添加
    arr.unshift(key);
    // 转成json  存到本地
    localStorage.setItem("search_list", JSON.stringify(arr));
  })
  // 功能3  添加排序功能

  // 需求 1 自己有current  切换箭头方法
  //  需求2  没有current 给自己加上  移除其他
  $(".lt_sort a[data-type]").on("tap",function () {
    if ($(this).hasClass("current")) {
      // 切换箭头
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      // 没有current
      $(this).addClass("current").siblings().removeClass("current");
    }
    // render();
     // render(); 不需要调用
    // 执行一次下拉刷新即可 在下拉刷新回调中 会进行页面渲染
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading(); //点击按钮  让下拉框执行一次
  });
  
  // 功能4  点击商品页面实现页面跳转  注册点击事件  通过事件委托注册 注册tap事件
  $(".lt_product").on("tap","a",function(){
    var id = $(this).data("id");
    location.href = "product.html?productId="+ id;
  })
})