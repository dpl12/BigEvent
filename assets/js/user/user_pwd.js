$(function () {
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //原密码与新密码校验,value为输入的input值
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码与原密码相同！';
            }
        },
        //新密码与确认密码校验
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！';
            }
        }
    })

    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('更新密码失败！');
                }
                layui.layer.msg('更新密码成功！');
                // console.log($('.layui-form')[0]);
                //重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})