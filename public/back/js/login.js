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
    })
});