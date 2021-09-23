$(function () {

    var laypage = layui.laypage;


    /*定义一个查询参数对象，
    将来请求数据的时候需要将请求参数对象提交到服务器*/
    var q = {
        pagenum: 1,//页码
        pagesize: 5,//每页条数
        cate_id: '',//文章分类的id
        state: ''   //文章的发布状态
    }

    //设置格式时间的过滤器dataFormat
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    //单数的日期或时间补0
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }


    initTable();
    initCate();

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('获取列表数据失败！');
                }
                // console.log(response);
                //使用模板引擎更新列表数据
                var htmlStr = template('tpl-table', response);
                $('tbody').html(htmlStr);
                //渲染完表格接着渲染分页
                renderPage(response.total);
            }
        })
    }

    //获取筛选的文章分类的选项数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('获取分类数据失败！');
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', response);
                $('[name=cate_id]').html(htmlStr);
                // 表单元素是动态插入的。这时 form 模块 的自动化渲染是会对其失效的
                // 执行 form.render(type, filter); 方法即可。
                layui.form.render();//解决没有选项渲染数据问题
            }
        })
    }

    //筛选的提交事件
    $('#form-search').submit(function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state').val();
        q.cate_id = cate_id;
        q.state = state;
        //查询出列表数据
        initTable();
    });

    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage来渲染分页区域
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,//每页数据
            curr: q.pagenum,//设置默认选中的页码
            //自定义分页排版功能
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [3, 5, 10],//自定义分页显示条数
            //切换分页时候触发jump,初始表格时也会触发jump
            //初始表格时触发jump会造成死循环，使用first布尔值解决
            jump: function (obj, first) {
                // console.log(first);//true和undefined
                //吧最新的页码值赋值给q查询对象的页码
                q.pagenum = obj.curr;

                //分页显示条数改变时，也要更新每页的表格数据数目
                q.pagesize = obj.limit;
                // frist不为true时，为切换分页时渲染表格
                if (!first) {
                    //根据最新的页码渲染表格
                    initTable();
                }
            }
        })
    }

    //删除功能
    $('body').on('click', '.btn-delete', function () {
        //获取当前页的删除按钮个数
        var len = $('.btn-delete').length;
        //获取文章的id
        var id = $(this).attr('data-id');
        //删除确认弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (response) {
                    if (response.status !== 0) {
                        return layui.layer.msg('删除文章失败！');
                    }
                    layui.layer.msg('文章删除成功！');
                    //当前页如果删除光之后，页码值应当减1
                    //解决方法：获取当前页的删除按钮个数，若果为0，说明当前页数据删除光了
                    if (len === 1) {
                        //如果当前页的删除个数为1，说明删除后就没数据了，页码值要减一
                        //页码值最小为1，当前为第一页时不减一
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    //更新列表
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})