$(function () {
    //调用getUserInfo接口获取当前用户信息
    getUserInfo();

    //退出功能
    $('#btnLogout').click(function () {
        //layui的提示confirm组件
        layui.layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            //确认后调用function(index)
            //清空本地存储的token
            localStorage.removeItem('token');
            //跳转到登录页面
            location.href = '/login.html';
            //关闭confirm
            layer.close(index);
        });
    })
})


// 获取当前用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (response) {
            // console.log(response);
            if (response.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            //渲染头像和用户名
            renderAvator(response.data);
        },
        //需求：控制index页面的访问权限，不登录不显示index页面(通过地址访问index时)
        //jQuery的ajax请求中，无论成功与否，都会调用complete回调函数
        // complete回调函数中拿到response.responseJSON数据，来处理访问权限
        // complete: function (response) {
        //     console.log(response);
        //     //如果身份验证失败就清除token，强制跳转到登录页面
        //     if (response.responseJSON.status === 1 &&
        //         response.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}

//渲染头像和用户名
function renderAvator(user) {
    //获取用户名称,设置用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //获取用户头像，如果有头像，就渲染图片头像，如果没有，就渲染文本头像
    if (user.user_pic !== null) {
        // 渲染图片头像:修改图片头像的src,隐藏文字头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染文本头像：取name的第一个字符的大写toUpperCase()显示，隐藏图片头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}