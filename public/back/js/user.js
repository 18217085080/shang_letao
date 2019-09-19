$(function () {
  var currentPage = 1; //当前页
  var pageSize = 5;  //每页条数
  var currentId;  //当前选中的id
  var isDelete;   //标记用户状态

  //  1 已进入页面 发送ajax请求获取用户列表数据 通过模板引擎渲染
  render();
  function render(){
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        // template(模板id, 数据对象)
        //  在模板中可以任意使用对象中属性
        var htmlStr = template('tpl', info);
        $('tbody').html(htmlStr);
  
  
        //  分页初始化
        $("#paginator").bootstrapPaginator({
          // p配置 bootstrap版本
          bootstrapMajorVersion: 3,
          // 指定总页数    总页数 / 每页条数
          totalPages: Math.ceil(info.total / info.size),
          // 当前页
          currentPage: info.page,
          // 给所有按钮 添加页码点击事件
          onPageClicked:function(a,b,c,page){
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        });
      }
    });
  
  }

  //  2 给所有启用禁用按钮  添加点击事件（通过事件委托绑定） 显示模态框
  $("tbody").on("click", ".btn", function () {
    // console.log("点击了");
    $("#userModal").modal("show");
    // 通过自定义属性  获取td中的id   并保存全局变量中
    currentId = $(this).parent().data("id");


    // 1 启用  0 禁用  传给后台几 后台就设置该用户状态为几
    //  通过判断类名 决定需要传递给后台  isDelete
    //  如果是禁用按钮 说明需要将该用户设置成禁用状态 传0
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    //  如果当前点击的按钮  有这个类  说明是禁用按钮  传 0 否则 传 1

  });

  //  3 点击确认按钮 发送ajax请求 修改对应的用户状态  需要两个参数（用户id isDelete用户改成的状态）
  $("#submitBtn").click(function () {
    //  显示当前选中的id
    console.log("用户id:" + currentId);
    console.log("用户状态:" + isDelete);
    //  发送ajax 请求
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId, //用户id
        isDelete: isDelete  //是否启用
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          // 修改成功
          // 关闭模态框  显示show 关闭hide
          $("#submitBtn").modal("hide");
          //  
        }

      }
    })
  })

});