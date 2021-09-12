/*发起请求时，url要写很长的地址，把公共的地址拿出来，用的时候去自动拼接
  1、使用get、post、Ajax发起请求时，先调用ajaxPrefilter函数
  2、在这个函数中，可以拿到给ajax提供的配置对象options
*/
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);
})
