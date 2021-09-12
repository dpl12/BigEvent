$(function () {
    //点击去注册账号
    $('#link-reg').click(function () {
        //隐藏登录，显示注册页
        $('.login-box').hide();
        $('.reg-box').show();
    });

    //点击去登录，显示登录，隐藏注册页
    $('#link-login').click(function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    //从layUI中获取form对象
    var form = layui.form;
    //从layUI中获取网页弹出层layer，用于信息提示
    var layer = layui.layer;
    //form.verify()设置校验规则
    form.verify({
        //自定义密码校验规则
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //确认密码与密码是否相同校验,value为当前确认密码输入的值
        repass: function (value) {
            //获取的密码框输入的值
            var pwd = $('.reg-box [name=password]').val();
            //比较确认密码与密码是否相同
            if (pwd !== value) {
                return '两次密码输入不一致';
            }
        }
    });

    //监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        //临时阻止默认提交行为
        e.preventDefault();
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }
        console.log(data);
        //发起Ajax请求
        $.post('/api/reguser',
            data, function (response) {
                if (response.status !== 0) {
                    // return response.message;
                    return layer.msg(response.message);
                }
                // console.log('注册成功');
                layer.msg('注册成功，请登录！');
                //注册完自动显示登录页
                $('#link-login').click();
            }
        )
    })

    //监听登录表单的提交事件
    $('#form-login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            //获取表单输入的数据使用serialize()方法
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // console.log(response.token);
                // token :Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzA5NTYsInVzZXJuYW1lIjoiZHBsIiwicGFzc3dvcmQiOiIiLCJuaWNrbmFtZSI6IiIsImVtYWlsIjoiIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2MzE0MzQ0MTQsImV4cCI6MTYzMTQ3MDQxNH0.4jFjFA1s-PN2_R-xWeumxXy9YT9DlyjleAM53U6s7Sc
                //将token存到localstorage中
                localStorage.setItem('token', response.token);
                //登录成功后跳转到后台首页
                location.href = '/index.html';
            }
        })
    })
})