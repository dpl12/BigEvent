$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //上传图片功能
    $('#getChooseImage').click(function () {
        $('#file').click();
    })
    //图片选择改变change事件
    $('#file').change(function (e) {
        //通过e事件来获得上传的文件信息
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return;
        }
        //拿到用户选择的图片
        var file = e.target.files[0];
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    //确定按钮点击事件
    $('#btnUpload').click(function () {
        //拿到裁剪后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //上传图片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('更换头像失败！');
                }
                layui.layer.msg('更换头像成功！');
                //更新父级index页面的头像
                window.parent.getUserInfo();
            }
        })
    })
})