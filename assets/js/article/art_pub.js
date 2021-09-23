$(function () {

  initCate();
  // 初始化富文本编辑器
  initEditor();


  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (response) {
        if (response.status !== 0) {
          layui.layer.msg('初始化文章分类失败！')
        }
        //获取成功，使用模板引擎渲染到分类选项中
        var htmlStr = template('tpl-cate', response);
        $('[name=cate_id]').html(htmlStr);
        //重新渲染表单区域，form.render()
        layui.form.render();
      }
    })
  }

  // 裁剪功能
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 选择封面功能
  $('#btnChooseImage').click(function () {
    $('#coverFile').click();
  })

  // 监听coverFile的改变事件，获取选择文件的列表
  $('#coverFile').change(function (e) {
    // 获取选择文件列表
    var files = e.target.files;
    //判断是否选择文件
    if (files.length === 0) {
      return;
    }
    // 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(files[0]);
    // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  //发布按钮的state为已发布(默认)，存为草稿按钮state为草稿
  var art_state = '已发布';
  $('#btnSave2').click(function () {
    art_state = '草稿';
  })

  //表单的提交事件
  $('#form-pub').submit(function (e) {
    e.preventDefault();
    // 基于form表单，创建一个FormData对象
    var fd = new FormData($(this)[0]);
    //将state追加到FromData中
    fd.append('state', art_state);

    // 将裁剪后的图片，输出为文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        //将文件对象追加到formdata中
        fd.append('cover_img', blob);
        //发表文章
        publishArticle(fd);
      })

  })
  //发表文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //向服务器提交FormData格式数据时，需要加contentType和processData属性
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.status !== 0) {
          return layui.layer.msg('发布文章失败！');
        }
        layui.layer.msg('发布文章成功！');
        //发布成功后跳转到文章列表页
        location.href = '/article/art_list.html';
      }
    })
  }
})