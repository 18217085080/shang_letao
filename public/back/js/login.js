/**
 * Created by user on 2019/9/16.
 */
$(function(){
    /*
     * 1. 进行表单校验配置
     *    校验要求:
     *        (1) 用户名不能为空, 长度为2-6位
     *        (2) 密码不能为空, 长度为6-12位
     * */
//    配置字段和input框中指定的name关联 所以必须要给input加上name
    $("#form").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
    //    配置字段
        fields:{
            username:{
            //配置校验规则
                validators:{
                //    非空
                    notEmpty:{
                    //    提示信息
                        message:"用户名不能为空"
                    },
                //    长度校验
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名差长度必须在2-6位"
                    },
                //    专门用于配置回调提示的规则
                    callback:{
                        message:"用户名不存在"
                    }
                }
            },
            password:{
               validators:{
                   notEmpty:{
                       message:"密码不能为空"
                   },
                   stringLength:{
                       min:4,
                       max:12,
                       message:"密码长度必须是 6-12 位"
                   },
                   callback:{
                       message:"密码错误"
                   }
               }
            }
        }
    });

    /*
     * 2. 登陆功能
     *    表单校验插件会在提交表单时进行校验
     *    (1) 校验成功, 默认就提交表单, 会发生页面跳转,
     *        我们需要注册表单校验成功事件, 阻止默认的提交, 通过ajax进行发送请求
     *    (2) 校验失败, 不会提交表单, 配置插件提示用户即可
     * */
//    注册表单校验成功事件
    $('#form').on("success.form.bv",function(e){
    //    阻止默认的表单提交
        e.preventDefault();
        console.log("校验成功后  表单提交被阻止了")
    //    通过 ajax进提交
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            //将提交的信息序列化
            data:$('#form').serialize(),
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                //    登录成功 跳转到首页
                    location.href = "index.html";
                }
                if(info.error ===1000){
                //  利用实例方法进行校验
                //    updateStatus（）  更新校验状态
                //    1  字段名称
                //    2 校验状态 VALID成功  INVALID失败  NOT_VALIDATED未校验的状态  VALIDATING校验中
                    $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
                }
                if(info.error ===1001){
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
            }
        })
    });
//    重置功能
    $('[type="reset"]').click(function(){
    //    调用插件的方法  进行重置校验状态
    //    resetForm(布尔值)
    //    1 传true  重置内容以及校验状态
    //    2 传false 只重置校验状态
        $("#form").data("bootstrapValidator").resetForm();
    })
});