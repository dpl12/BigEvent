$(function () {

    var form = layui.form;
    initArtCateList();


    //获取文章列表数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (response) {
                if (response.status !== 0) {
                    layui.layer.msg('数据获取失败！');
                }
                // console.log(response);
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', response);
                $('tbody').html(htmlStr);
            }
        })
    }

    //添加的点击事件
    var indexAdd = null;//弹出层的索引
    $('#btnAddCate').click(function () {
        // 弹出层layer.open
        indexAdd = layui.layer.open({
            type: 1,  //弹出层为页面层类型
            area: ['500px', '250px'],//弹出层的宽高
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    // 弹出的from是js动态添加的，因此拿不到form，所有使用代理的形式调用form
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        //添加文章请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('新增分类失败！');
                }
                //重新获取文章列表
                initArtCateList();
                layui.layer.msg('新增分类成功！');
                //根据弹出层的索引来关闭弹出层
                layui.layer.close(indexAdd);
            }
        })
    });

    // 使用代理的形式调用编辑按钮的点击事件
    var indexEdit = null;//修改弹出层的索引
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出层layer.open
        indexEdit = layui.layer.open({
            type: 1,  //弹出层为页面层类型
            area: ['500px', '250px'],//弹出层的宽高
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        //或文章分类的自定义属性data-id的id值
        var id = $(this).attr('data-id');
        // console.log(id);
        //发起请求获取文章分类信息填充表单
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            // params: {
            //     id: id
            // },
            success: function (response) {
                console.log(response)
                form.val('form-edit', response.data);
            }
        })
    })

    // 使用代理的形式调用编辑按钮的提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('更新文章类别失败！');
                }
                layui.layer.msg('更新文章类别成功！');
                layui.layer.close(indexEdit);
                console.log(response);
                //更新文章类别列表数据
                initArtCateList();
            }
        })
    })

    // 使用代理的形式调用删除按钮的点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 删除提示层
        layui.layer.confirm('确认删除？', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function (response) {
                        if (response.status !== 0) {
                            return layui.layer.msg('删除分类失败！');
                        }
                        layui.layer.msg('删除分类成功！');
                        layui.layer.close(index);
                        initArtCateList();
                    }
                })
            });
    })
})