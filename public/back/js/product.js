$(function(){
  var currentPage = 1 ;  //当前页
  var pageSize = 5;  //没有条数
  // 1 已进入页面进行渲染  发送ajax请求进行渲染
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      // 后台如果在响应头中, 设置了响应头 Content-Type: application/json;
      // 前端可以省略  dataType: "json"
      // dataType:"josn",
      success: function(info){
        console.log(info);
        var htmlStr = template("productTpl",info);
        $("tbody").html(htmlStr);
       
      // 分页初始化
      $('#paginator').bootstrapPaginator({
        // 版本号
        bootstrapMajorVersion:3,
        // 当前页
        currentPage:info.page,
        // 总页数
        totalPages:Math.ceil(info.total / info.size),


        //  给页码添加点击事件
        onPageClicked:function (a,b,c,page) {
          // 更新当前页 
          currentPage = page;
          // 重新渲染当前
          render();
        }
      })

      }
    })
  }
});