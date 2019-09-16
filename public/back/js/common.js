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
})