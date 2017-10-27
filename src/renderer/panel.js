//容器控件渲染器
flyingon.renderer('Panel', function (base) {
    
    

    //不渲染padding
    this.padding = false;


    //auto时也要设置大小
    this.__auto_size = 1;
    
    

    //渲染html
    this.render = function (writer, control, render) {

        writer.push('<div');
        
        render.call(this, writer, control);
        
        writer.push(' onscroll="flyingon.__dom_scroll.call(this, event)">');

        if (control.length > 0 && control.__visible)
        {
            control.__content_render = true;
            this.__render_children(writer, control, control, 0, control.length);
        }

        //滚动位置控制(解决有右或底边距时拖不到底的问题)
        writer.push(this.__scroll_html, '</div>');
    };


    //重新渲染内容
    this.__render_content = function (control, view) {

        var writer = [];

        //标记已渲染
        control.__content_render = true;

        this.__render_children(writer, control, control, 0, control.length);

        writer.push(this.__scroll_html);

        view.innerHTML = writer.join('');
        this.mount(control, view);
    };



    this.mount = function (control, view) {

        base.mount.call(this, control, view);

        if (control.__content_render)
        {
            view = control.view_content || view;
            this.__mount_children(control, view, control, 0, control.length, view.firstChild);
        }
    };


    this.unmount = function (control) {

        control.view = control.view_content = null;

        this.__unmount_children(control);
        base.unmount.call(this, control);
    };


    //排列
    this.__arrange = function (control) {

        var list = [],
            storage = control.__storage || control.__defaults,
            hscroll, 
            vscroll,
            any;

        if (control.__auto_width)
        {
            control.__hscroll = false;
        }
        else
        {
            //处理自动滚动
            switch (storage.overflowX) //有些浏览器读不到overflowX的值
            {
                case 'scroll':
                    control.__hscroll = true;
                    break;

                case 'hidden':
                    control.__hscroll = false;
                    break;
                    
                default:
                    hscroll = true;
                    break;
            }
        }

        if (control.__auto_height)
        {
            control.__vscroll = false;
        }
        else
        {
            switch (storage.overflowY)
            {
                case 'scroll':
                    control.__vscroll = true;
                    break;

                case 'hidden':
                    control.__vscroll = false;
                    break;

                default:
                    vscroll = true;
                    break;
            }
        }

        //筛选出非隐藏控件
        for (var i = 0, l = control.length; i < l; i++)
        {
            if ((any = control[i]) && any.__visible)
            {
                list.push(any);
            }
        }

        //排列
        flyingon.arrange(control, list, hscroll, vscroll);

        this.__sync_scroll(control);
    };



    this.locate = function (control) {

        base.locate.call(this, control);
        
        if (control.length > 0 && !control.__content_render)
        {
            this.__render_content(control, control.view_content || control.view);
        }

        //需要排列先重排
        if (control.__update_dirty > 1)
        {
            this.__arrange(control);
            this.__locate_scroll(control);
        }
 
        //定位子控件
        for (var i = 0, l = control.length; i < l; i++)
        {
            var item = control[i];

            if (item && item.view)
            {
                item.renderer.locate(item);
            }
        }
        
        control.__update_dirty = 0;
    };


    //定位滚动条
    this.__locate_scroll = function (control) {

        var style = (control.view_content || control.view).lastChild.style, //内容位置控制(解决有右或底边距时拖不到底的问题)
            cache = control.__scroll_cache || (control.__scroll_cache = {}),
            any;

        if (control.__hscroll_length !== (any = control.arrangeRight))
        {
            style.width = (control.__hscroll_length = any) + 'px'; 
        }

        if (control.__vscroll_length !== (any = control.arrangeBottom))
        {
            style.height = (control.__vscroll_length = any) + 'px'; 
        }
    };



});