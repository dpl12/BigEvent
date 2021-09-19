/*发起请求时，url要写很长的地址，把公共的地址拿出来，用的时候去自动拼接
  1、使用get、post、Ajax发起请求时，先调用ajaxPrefilter函数
  2、在这个函数中，可以拿到给ajax提供的配置对象options(ajax(options))
*/
$.ajaxPrefilter(function (options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
  // console.log(options.url);
  //统一为有权限(接口my)的接口，设置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 控制index页面的访问权限，不登录不显示index页面(通过地址访问index时)
  options.complete = function (response) {
    // console.log(response);
    //如果身份验证失败就清除token，强制跳转到登录页面
    if (response.responseJSON.status === 1 &&
      response.responseJSON.message === "身份认证失败！") {
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
  }
})
