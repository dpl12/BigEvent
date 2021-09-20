$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //表单验证
    form.verify({
        //昵称的验证
        nickname: function (value) {
            if (value.length > 6 || value.length == 1) {
                return '昵称长度必须在1~6个字符之间';
            }
        }
    })
    initUserInfo();
    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                console.log(response);

                //使用form.val()为表单全部赋值/取值
                form.val('formUserInfo', response.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').click(function (e) {
        //阻止默认重置功能
        e.preventDefault();
        //重新初始化数据
        initUserInfo();
    })

    //监听表单的提交事件
    $('.layui-form').submit(function (e) {
        //阻止默认重置功能
        e.preventDefault();
        //发起更新数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    layer.msg('用户信息修改失败！');
                }
                layer.msg('更新用户信息成功！');
                //跨区域调用父元素index页面的方法，重新渲染用户昵称和头像
                window.parent.getUserInfo();
            }
        })
    })
})
