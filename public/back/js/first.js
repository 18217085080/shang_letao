$(function () {

  var  currentPage = 1;
  var  pageSize =5;
  render();
  function render(){
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        var htmlStr =template("firstTpl",info);
        $("tbody").html(htmlStr);
      // 分页初始化
      $("#paginator").bootstrapPaginator({
        // 指定当前的版本号
        bootstrapMajorVersion:3,
        // 当前页
        currentPage: info.page,
        // 总页数
        totalPages:Math.ceil(info.total / info.size),
        //  给页码添加点击事件
        onPageClicked:function(a,b,c,page){
          // 更新当前 重新熏染
          currentPage = page;
          render();
        }
      });
      }
    });
  }
});