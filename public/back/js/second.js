$(function(){
  var currentPage = 1;//当前页
  var pageSize = 5;  //没有条数
  //已进入页面进行渲染  发送ajax请求进行渲染
  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template ("secondTpl",info);
        $(".lt_content tbody").html(htmlStr);


        // 进行页面初始化
        $("#paginator").bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion:3,
          // 当前页
          currentPage:info.page,
          // 总页数
          totalPages:Math.ceil(info.total / info.size),
          // 添加按钮点击事件
          onPageClicked:function(a,b,c,page){
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  }
});