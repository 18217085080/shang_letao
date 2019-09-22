$(function () {
  var currentPage = 1;  //当前页
  var pageSize = 5;  //没有条数


  //  定义 用来存储已上传图片 进行页面渲染
  var picArr = [];
  // 1 已进入页面进行渲染  发送ajax请求进行渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      // 后台如果在响应头中, 设置了响应头 Content-Type: application/json;
      // 前端可以省略  dataType: "json"
      // dataType:"josn",
      success: function (info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),

          // 配置按钮大小
          size: "normal",
          // 配置文本
          //  每个按钮在初始化的时候 都会调用一次这个函数 通过返回值进行设置文本
          //  参数1 type 取值  page  first last prev next
          //  参数page 值当前这个按钮所指向的页码
          //  参数3 current 当前
          itemTexts: function (type, page, current) {
            //  console.log(arguments);
            // switch case

            switch (type) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }

          },

          // 配置title提示信息
          // 每个按钮在初始化的时候都会调用一次这个函数  通过返回值设置title文本
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          // 使用bootstrap的提示框组件
          useBootstrapTooltip: true,
          //  给页码添加点击事件
          onPageClicked: function (a, b, c, page) {
            // 更新当前页 
            currentPage = page;
            // 重新渲染当前
            render();
          }
        })

      }
    })
  };

  // 2点击添加商品按钮  显示添加模态框
  $("#addBtn").click(function () {
    $('#addModal').modal("show");

    // 发送ajax请求  请求所有的二级分类数据  进行下拉列表渲染
    //  通过分页接口 模拟获取全部数据接口
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
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


  //  3 给dropdown-menu  下面的a 注册点击事件（通过事件委托）
  $(".dropdown-menu").on("click", "a", function () {
    //  设置文本 
    var txt = $(this).text();
    $("#dropdownText").text(txt);

    //  设置id给隐藏隐藏域   name="categoryId"

    var id = $(this).data("id");
    $('[name="brandId"]').val(id);

    // 重置表单校验
    $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");
  });

  //  4 文件上传初始化
  //  多文件上传时 插件会遍历选中的图片 发送多次请求服务器 响应多次
  // 每次响应都会调用一次 done 方法
  $("#fileupload").fileupload({
    dataType: "json",
    // e 事件对象
    // data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data.result);
      // data.result 是后台响应的内容
      //  unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
      picArr.unshift(data.result)

      // 往imgBox 最前面添加 img元素
      $('#imgBox').prepend('<img src="' + data.result.picAddr + '" width="100" alt="">');


      // 通过判断数组长度  如果数组长度大于3
      if (picArr.length > 3) {
        // 移除数组最后一项
        picArr.pop();

        // 移除imgBox中的最后一张图片
        $("#imgBox img:last-of-type").remove();
      }

      //  如果处理后 图片数组长度为3  那么通过校验手动进picStatus 制成 VALID
      if(picArr.length === 3){
        $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
      }
    }


  });


  //  5 进行表单校验初始化

  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // 默认插件不对隐藏域进行校验  现在需要对隐藏域进行校验
    // excluded: [':disabled', ':hidden', ':not(:visible)'],

    //  重置排除项
    excluded:[],
      // 配置校验图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',    // 校验成功
        invalid: 'glyphicon glyphicon-remove',  // 校验失败
        validating: 'glyphicon glyphicon-refresh' // 校验中
      },
      // 配置校验字段
      fields:{
        // 选择二级分类
        brandId:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请选择二级分类"
            }
          }
        },
        // 产品分类
        proName:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入商品名称"
            }
          }
        },
        // 选择二级分类
        proDesc:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入商品描述"
            }
          }
        },
        // 选择二级分类
        num:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入商品库存"
            },
            // 正则校验
            // \d  表示数字 0-9
            // +   表示出现一次或多次
            // * 表示出现 0次或多次
            //  ？ 表示出现0次或1次
            regexp:{
              regexp:/^[1-9]\d*$/,
              message:'商品库存必须是非零开头的数字'
            }
          }
        },
        // 选择二级分类
        size:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入商品尺码"
            },
            regexp:{
              regexp:/^\d{2}-\d{2}$/,  //{2} 出现几次
              message:'尺码必须是 xx-xx 的格式 列如：32-40'
            }
          }
          
        },
        // 选择二级分类
        oldPrice:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入商品原价"
            }
          }
        },
        // 选择二级分类
        price:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入商品现价"
            }
          }
        },
        // 选择二级分类
        picStatus:{
          // 配置校验规则
          validators:{
            notEmpty:{
              message:"请输入三张图片"
            }
          }
        },
      }
  });


  // 6.注册表单校验成功事件，阻止默认提交 通过ajax进行提交
  $("#form").on("success.form.bv",function(e){
    // 阻止默认的提交
    e.preventDefault();

    //  获取的表单元素的数据
    var paramsStr = $("#form").serialize();
    paramsStr += "$picName1="+picArr[0].picName+"$picAddr1"+picArr[0].picAddr;
    paramsStr += "$picName2="+picArr[1].picName+"$picAddr2"+picArr[1].picAddr;
    paramsStr += "$picName3="+picArr[2].picName+"$picAddr3"+picArr[2].picAddr;
    // 还需要拼接上图片的数据
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      data:paramsStr,
      dataType:"json",
      success:function(info){
        console.log(info);
        if ( info.success ) {
          // 添加成功

          // 关闭模态框
          $('#addModal').modal("hide");

          // 页面重新渲染第一页
          currentPage = 1;
          render();

          //重置表单内容和校验状态
          $('#form').data("bootstrapValidator").resetForm(true);

          // 下拉列表 和 图片 不是表单元素, 需要手动重置
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove(); // 让所有的图片自杀
        }
      }
    })
  });
});