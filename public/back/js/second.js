$(function () {
  var currentPage = 1;//当前页
  var pageSize = 5;  //没有条数
  //已进入页面进行渲染  发送ajax请求进行渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("secondTpl", info);
        $(".lt_content tbody").html(htmlStr);


        // 进行页面初始化
        $("#paginator").bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 添加按钮点击事件
          onPageClicked: function (a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  };
  //  2 点击添加分类按钮
  $("#addBtn").click(function () {
    $("#addModal").modal("show");

    //  3 发送ajax请求  获取所有一级数据  进行动态渲染下拉框
    // 通过获取一级分类接口(带分页的) 模拟获取全部一级分类接口
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);

        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);

      }
    })
  });

  //    给下拉列表 a  添加点击事件 (通过事件委托绑定)

  $(".dropdown-menu").on("click", "a", function () {
    // 获取 a 的文本
    var txt = $(this).text();
    // 设置 给按钮
    $("#dropdownText").text(txt);
    //  获取a 标签存储的 分类id
    var id = $(this).data("id");
    // 赋值给 name="categoryId" 的表单元素
    $('[name="categoryId"]').val(id);

    // 更新校验状态为  校验通过状态
    // updateStatus(字段名称，校验状态，校验规则(可以配置提示信息))
    $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID")

  });

  // 5 配置文件上传
  $("#fileupload").fileupload({
    // 配置返回数据格式
    dataType: "json",
    //  上传完成图片后 调用回调函数
    // result:
    //   picAddr: "/upload/brand/0dd51920-dc4e-11e9-b693-db6785c31a7c.jpg"
    done: function (e, data) {
      console.log(data.result.picAddr);
      //  获取地址
      var imgUrl = data.result.picAddr;
      // 设置给img
      $("#imgBox img").attr("src", imgUrl)
      // 将地址设置给  name="brandLogo"
      $('[name="brandLogo"]').val(imgUrl);
      // 更新校验状态为  校验通过状态
    // updateStatus(字段名称，校验状态，校验规则(可以配置提示信息))
    $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID")
    }
  });


  //   6 进行表单校验初始化
  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // 默认插件不对隐藏域进行校验  现在需要对隐藏域进行校验
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 3.配置字段
    fields:{
       //categoryId 选择的一级分类 id
      //brandName  二级分类名称
      //brandLogo  上传的图片地址

      // 校验用户名  对应name表单的name属性
      categoryId:{
        // 配置校验规则
        validators:{
        //  非空
          notEmpty:{
            message:"请选择一级父类"
          }
        }
      },
      brandName:{
        // 配置校验规则
        validators:{
        //  非空
          notEmpty:{
            message:"请输入二级父类"
          }
        }
      },
      brandLogo:{
        // 配置校验规则
        validators:{
        //  非空
          notEmpty:{
            message:"请输入二级父类"
          }
        }
      },
    }
  });


  // 7 注册表单校验成功事件  阻止默认的表单提交，通过ajax进行提交
  //  当表单校验成功时，会触发success.form.bv事件，此时会提交表单，
  // 这时候，通常我们需要禁止  表单的默认或自动提交自动提交，使用ajax进行表单的提交。
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();
    // 通过ajax进行提交
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$("#form").serialize(),  //通过序列化获取到提交的信息
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          // 添加成功
          // 隐藏模态框
          $("#addModal").modal("hide");
          // 页面重新渲染
          currentPage = 1;
          render();

          // 操作表单元素  校验状态和文本都要重置 
          $("#form").data("bootstrapValidator").reseForm(true);

          // 下拉按钮的文本  图片不是表单元元素  需要手动设置
          $()
        }
      }
    })
  })
});