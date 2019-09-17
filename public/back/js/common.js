/**
 * Created by user on 2019/9/16.
 */
// 实现在第一个ajax发送的时候  开启进度条
//在所有的ajax请求都完成的时候  结束=进度条
//ajax 全局事件
//1 ajaxComplete 当每个ajax请求完成的时候  调用（不管成功还是失败都调用）
//2 ajaxError    当ajax发送请求失败时候，调用
//3 ajaxSuccess  当ajax发送请求成功时候，调用
//4 ajaxSend    在每一个ajax发送请求前，调用
//5 ajaxStart  在第一个ajax发送时  调用
//6 ajaxStop   在所有的ajax请求完成是调用

$(document).ajaxStart(function(){
//    开始进度条
    NProgress.start();
})
$(document).ajaxStop(function(){
//    ，模拟网络延迟
    setTimeout(function(){
    //    关闭进度条
        NProgress.done();
    },(500));
});

//登录拦截功能 登录拦击页面不需要校验  不用登录就能访问
//发送ajax请求 查询用户状态即可
//（1） 用户已登录 啥也不用做 让用户继续访问
// （2） 用户未登录 拦截到登录页
//indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
//如果没有找到匹配的字符串则返回 -1
// location.href  当前的地址栏
//在地址栏中没找到 login.html === -1  说明没找到登录页
if (location.href.indexOf("login.html") === -1){
//    地址栏中没有login.html  说明不是登录页 需要进行拦截登录
$.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function( info ) {
        console.log( info )
        if ( info.success ) {
            // 已登录, 让用户继续访问
            console.log("用户已登录")
        }

        if ( info.error === 400 ) {
            // 未登录, 拦截到登录页
            location.href = "login.html";
        }
    }
})
}

$(function(){
//    1 分类管理切换功能
    $(".nav .category").click(function(){
    //    切换child的显示按钮
       $(".nav .child").stop().slideToggle();
    });
//    2 左侧边栏切换功能
    $(".icon-menu").click(function(){
      $(".lt_aside").toggleClass("hidnmenu");
      $(".lt_topbar").toggleClass("hidnmenu");
        $(".lt_main").toggleClass("hidnmenu");
    });
//    点击topbar退出按钮  弹出模态框
    $(".icon-logout").click(function(){
        $("#logoutModal").modal("show");
    })
//    4 点击模态框的退出功能   实现推迟功能
    $("#logoutBtn").click(function(){
    //    发送ajax请求 进行退出
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                //    退出成功跳到登录页
                    location.href = "login.html";
                }
            }
        })
    })

});