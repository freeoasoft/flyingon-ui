//控件渲染器
(function () {
    
    

    //是否右向顺序
    flyingon.rtl = false;



    var self = this;

    //注册的渲染器集合
    var registry_list = flyingon.create(null);

    //唯一id
    var uniqueId = flyingon.__uniqueId;

    //创建html的dom节点(给createView用)
    var dom_html = document.createElement('div');

    //margin border padding css样式缓存
    var sides_cache = flyingon.create(null);

    //css名称映射
    var css_map = flyingon.css_map(true);

    //style名称映射
    var style_map = flyingon.css_map();



    //滚动条位置控制
    this.__scroll_html = '<div class="f-scroll" style="position:static;overflow:hidden;visibility:hidden;margin:0;border:0;padding:0;width:1px;height:1px;"></div>';

       
    //设置text属性名
    this.__text_name = 'textContent' in document.head ? 'textContent' : 'innerText';

    
    //是否支持auto
    this.__auto_size = 0;


    //设置lineHeight方法
    //0 不设置
    //1 直接设置到控件style上
    //function 自定义函数 
    this.lineHeight = 0;



    function css_sides(value) {

        var any = +value;

        if (any === any)
        {
            return sides_cache[value] = (any | 0) + 'px';
        }

        return sides_cache[value] = value ? value.replace(/(\d+)(\s+|$)/g, '$1px$2') : '';
    };



    //创建控件视图
    this.createView = function (control) {

        var host = dom_html,
            view,
            any;

        this.render(any = [], control, this.__render_default);

        host.innerHTML = any.join('');

        view = host.firstChild;
        host.removeChild(view); //需先从父节点移除,否则在IE下会被销毁

        host.innerHTML = '';

        this.mount(control, view);

        return view;
    };


    //渲染html
    this.render = function (writer, control, render) {

        writer.push('<div');

        render.call(this, writer, control);

        writer.push('></div>');
    };


    //默认渲染方法
    function render(writer, control) {

        var storage = control.__storage || control.__defaults,
            text,
            any;

        if (any = storage.id)
        {
            writer.push(' id="', any, '"');
        }

        text = control.defaultClass;

        if (any = control.__className)
        {
            text += ' ' + any;
        }

        writer.push(' class="', text, '" style="');

        if (any = render.cssText)
        {
            render.cssText = ''
            writer.push(any);
        }

        if (!storage.visible)
        {
            writer.push('display:none;');
        }

        writer.push('"');
    };


    (this.__render_default = render).cssText = '';



    //挂载视图
    this.mount = function (control, view) {

        var any;
        
        control.view = view;

        if (!(any = control.__uniqueId))
        {
            any = uniqueId;
            any[any = any.id++] = control;
        }

        view.flyingon_id = any;

        //应用补丁
        if (any = control.__locate_patch)
        {
            this.__locate_patch(control, view, any);
        }

        if (any = control.__style_patch)
        {
            this.__style_patch(control, view, any);
        }

        if (any = control.__view_patch)
        {
            this.__view_patch(control, view, any);
        }

        //触发控件挂载过程
        if (any = control.onmount)
        {
            any.call(control, view);
        }
    };


    //取消视图挂载
    this.unmount = function (control, remove) {

        var view = control.view,
            any;

        if (view)
        {
            //触发注销控件挂载过程
            if (any = control.onunmount)
            {
                any.call(control, view);
            }

            control.view = null;

            if (remove !== false && (any = view.parentNode))
            {
                any.removeChild(view);
            }
        }
    };



    //更新控件
    this.update = function (control) {
    };


    //定位
    this.locate = function (control) {

        var view = control.view,
            style = view.style,
            cache = control.__style_cache,
            left = control.offsetLeft | 0,
            top = control.offsetTop | 0,
            width = control.offsetWidth | 0,
            height = control.offsetHeight | 0,
            auto = this.__auto_size,
            any;

        if (any = !cache)
        {
            cache = control.__style_cache = {};
        }

        if (any || left !== cache.left)
        {
            //右向顺序设置right,否则设置left
            style[flyingon.rtl ? 'right' : 'left'] = (cache.left = left) + 'px';
        }

        if (any || top !== cache.top)
        {
            style.top = (cache.top = top) + 'px';
        }

        if ((auto || !control.__auto_width) && width !== cache.width)
        {
            cache.width = width;
            style.width = width + 'px';
        }

        if ((auto || !control.__auto_height) && height !== cache.height)
        {
            cache.height = height;
            style.height = height = height + 'px';

            if (any = this.lineHeight)
            {
                if (any === 1)
                {
                    view.style.lineHeight = height;
                }
                else
                {
                    any.call(this, control, view, height);
                }
            }
        }

        return cache;
    };



    //需要处理视图补丁的控件集合
    var patchList = [];

    //子项变更补丁集合
    var childList = [];

    //延迟更新队列
    var delayList = [];
    
    //更新定时器
    var delayTimer;
    
        
    //立即更新所有控件
    flyingon.update = function () {
        
        if (delayTimer)
        {
            clearTimeout(delayTimer);
            delayTimer = 0;
        }

        flyingon.__update_patch();
    };


    //延时更新
    flyingon.__update_delay = function (control) {
      
        if (delayList.indexOf(control) < 0)
        {
            delayList.push(control);
            delayTimer || (delayTimer = setTimeout(flyingon.update, 0)); //定时刷新
        }
    };


    //更新所有挂起的dom补丁(在调用控件update前需要先更新补丁)
    flyingon.__update_patch = function () {

        var list = childList,
            index = 0,
            item,
            view,
            any;

        //先处理子项变更
        while (item = list[index++])
        {
            if (any = item.__children_patch)
            {
                item.__children_patch = null;
                item.renderer.__children_patch(item, any);
            }
        }

        //再处理视图变更
        list = patchList;
        index = 0;

        while (item = list[index++])
        {
            item.__delay_patch = false;

            if (view = item.view)
            {
                if (any = item.__locate_patch)
                {
                    item.renderer.__locate_patch(item, view, any);
                }

                if (any = item.__style_patch)
                {
                    item.renderer.__style_patch(item, view, any);
                }

                if (any = item.__view_patch)
                {
                    item.renderer.__view_patch(item, view, any);
                }
            }
        }

        childList.length = patchList.length = 0;

        update_top();
    };

    
    //注册延时
    flyingon.__register_delay = function (control) {
        
        control.__delay_patch = true;
        patchList.push(control);
        
        delayTimer || (delayTimer = setTimeout(flyingon.update, 0)); //定时刷新
    };



    function update_top() {

        var list = delayList,
            index = 0,
            item,
            any;

        while (item = list[index++])
        {
            if (any = item.__update_dirty)
            {
                if (any > 1)
                {
                    if ((any = item.view) && (any = any.parentNode))
                    {
                        var width = any.clientWidth, 
                            height = any.clientHeight;

                        item.__location_values = null;
                        item.left = item.top = 0;

                        item.measure(width, height, width, height, height ? 3 : 1);
                        item.renderer.locate(item);
                    }
                }
                else
                {
                    update_children(item);
                }
            }
        }

        list.length = 0;
    };


    //递归更新子控件
    function update_children(control) {

        control.__update_dirty = 0;

        for (var i = 0, l = control.length; i < l; i++)
        {
            var item = control[i];

            switch (item.__update_dirty)
            {
                case 2:
                    if (item.__is_locate)
                    {
                        item.renderer.locate(item);
                    }
                    else
                    {
                        clear_update(item);
                    }
                    break;

                case 1:
                    update_children(item);
                    break;
            }
        }
    };


    function clear_update(control) {

        control.__update_dirty = 0;

        for (var i = control.length - 1; i >= 0; i--)
        {
            var item = control[i];

            if (item.__update_dirty)
            {
                clear_update(item);
            }
        }
    };
    


    //注册样式补丁
    this.style = function (control, name, value) {

        var patch = control.__style_patch;

        if (patch)
        {
            patch[name] = value;
        }
        else
        {
            (control.__style_patch = {})[name] = value;
            
            if (control.view && !control.__delay_patch)
            {
                control.__delay_patch = true;
                patchList.push(control);

                delayTimer || (delayTimer = setTimeout(flyingon.update, 0)); //定时刷新
            }
        }
    };


    //注册视图补丁
    this.patch = function (control, name, value) {

        var patch = control.__view_patch;

        if (patch)
        {
            patch[name] = value;
        }
        else
        {
            (control.__view_patch = {})[name] = value;
            
            if (control.view && !control.__delay_patch)
            {
                control.__delay_patch = true;
                patchList.push(control);
                
                delayTimer || (delayTimer = setTimeout(flyingon.update, 0)); //定时刷新
            }
        }
    };


    //注册子项变更补丁
    this.__children_dirty = function (control) {

        childList.push(control);
        delayTimer || (delayTimer = setTimeout(flyingon.update, 0)); //定时刷新
    };


    //应用定位补丁
    this.__locate_patch = function (control, view, patch) {

        var style = view.style,
            any;

        control.__locate_patch = null;

        for (var name in patch)
        {
            switch (name)
            {
                case 'border':
                    style.borderWidth = sides_cache[any = patch.border] || css_sides(any);
                    break;

                case 'margin':
                    style.margin = sides_cache[any = patch.margin] || css_sides(any);
                    break;

                case 'padding':
                    if (any = this.padding)
                    {
                        any.call(this, control, view, sides_cache[any = patch.padding] || css_sides(any));
                    }
                    else if (any !== false)
                    {
                        style.padding = sides_cache[any = patch.padding] || css_sides(any);
                    }
                    break;

                default:
                    style[name] = (any = patch[name]) > 0 ? any + 'px' : any;
                    break;
            }
        }
    };


    //应用样式补丁
    this.__style_patch = function (control, view, value) {

        var map = style_map,
            style = view.style,
            any;

        control.__style_patch = null;

        for (var name in value)
        {
            switch (any = this[name])
            {
                case 1: //直接设置样式
                    style[name] = value[name];
                    break;

                case 2: //需要检测前缀
                    style[map[name]] = value[name];
                    break;

                case 9: //特殊样式
                    flyingon.css_value(view, name, value[name]);
                    break;

                default:
                    if (typeof any !== 'function')
                    {
                        if (any = map[name])
                        {
                            style[any] = value[name];
                            self[name] = any === name ? 1 : 2; //直接设置样式标记为1,需要加前缀标记为2
                        }
                        else
                        {
                            flyingon.css_value(view, name, value[name]);
                            self[name] = 9; //标记为特殊样式
                        }
                    }
                    else
                    {
                        any.call(this, control, view, value[name]);
                    }
                    break;
            }
        }
    };


    //应用视图补丁
    this.__view_patch = function (control, view, patch) {

        var fn, value;

        control.__view_patch = null;

        for (var name in patch)
        {
            //已处理过则不再处理
            if ((value = patch[name]) === null)
            {
                continue;
            }

            if (fn = this[name])
            {
                if (typeof fn === 'function')
                {
                    fn.call(this, control, view, value);
                }
            }
            else //作为属性处理
            {
                if (value || value === 0)
                {
                    view.setAttribute(name, value);
                }
                else
                {
                    view.removeAttribute(name);
                }
            }
        }
    };



    this.className = function (control, view, value) {

        var name = control.defaultClass;

        if ((control.__storage || control.__defaults).disabled)
        {
            name += ' f-disabled';
        }

        if (value)
        {
            name += ' ' + value;
        }

        view.className = name;
    };


    this.visible = function (control, view, value) {

        view.style.display = value ? '' : 'none';
    };


    this.disabled = function (control, view, value) {

        if (value)
        {
            view.className += ' f-disabled';
        }
        else
        {
            view.className = view.className.replace(' f-disabled', '');
        }
    };


    this.focus = function (control) {

        control.view.focus();
    };


    this.blur = function (control) {

        control.view.blur();
    };



    this.__do_scroll = function (control, x, y) {
    };


    this.__do_focus = function (control) {
    };


    this.__do_blur = function (control) {
    };



    //渲染子项
    this.__render_children = function (writer, control, items, start, end) {

        var render = this.__render_default,
            item;

        while (start < end)
        {
            if (item = items[start++])
            {
                item.view || item.renderer.render(writer, item, render);
            }
        }
    };


    //挂载子控件
    this.__mount_children = function (control, view, items, start, end, node) {

        var item, any;

        while (start < end)
        {
            if (item = items[start++])
            {
                //如果子控件已经包含view
                if (any = item.view)
                {
                    view.insertBefore(any, node);
                }
                else //子控件不包含view则分配新渲染的子视图
                {
                    item.renderer.mount(item, node);
                    node = node.nextSibling;
                }
            }
        }
    };


    //取消挂载子控件
    this.__unmount_children = function (control) {

        for (var i = control.length - 1; i >= 0; i--)
        {
            var item = control[i];

            if (item && item.view && !item.parent)
            {
                item.renderer.unmount(item, false);
            }
        }
    };



    this.__measure_auto = function (control, autoWidth, autoHeight) {

        var view = control.view;

        if (autoWidth)
        {
            control.offsetWidth = view && view.offsetWidth || 0;
        }

        if (autoHeight)
        {
            control.offsetHeight = view && view.offsetHeight || 0;
        }
    };



    //同步滚动条状态
    //overflow:auto在某些情况下可能会不准确,通过直接设置scroll或hidden解决些问题
    this.__sync_scroll = function (control) {

        var style = (control.view_content || control.view).style;

        style.overflowX = control.__hscroll ? 'scroll' : 'hidden';
        style.overflowY = control.__vscroll ? 'scroll' : 'hidden';
    };



    //子项补丁
    this.__children_patch = function (control, patch) {

        for (var i = 0, l = patch.length; i < l; i++)
        {
            switch (patch[i++])
            {
                case 1: //增加子项
                    this.__insert_patch(control, patch[i++], patch[i]);
                    break;

                case 2: //删除子项
                    this.__remove_patch(control, patch[++i]);
                    break;
            }
        }
    };
    

    //插入子项
    this.__insert_patch = function (control, index, items) {

        var view = control.view_content || control.view;
        this.__unmount_html(control, view, items, 0, items.length, view.children[index] || null);
    };


    //插入未挂载的html片段
    this.__unmount_html = function (control, view, items, start, end, tag) {

        var writer = [],
            node = tag && tag.previousSibling,
            item;

        this.__render_children(writer, control, items, start, end);
        
        writer[0] && flyingon.dom_html(view, writer.join(''), tag);

        node = node && node.nextSibling || view.firstChild;

        this.__mount_children(control, view, items, start, end, node);
    };


    //移除子项
    this.__remove_patch = function (control, items) {

        var item, node, any;
        
        for (var i = 0, l = items.length; i < l; i++)
        {
            if (item = items[i])
            {
                if ((node = item.view) && (any = node.parentNode)) //否则从dom树移除
                {
                    any.removeChild(node);
                }

                //允许自动销毁且没有父控件则销毁控件
                if (item.autoDispose && !item.parent)
                {
                    item.dispose();
                }
            }
        }
    };



    //控件顺序发生变化的补丁
    this.__view_order = function (control, view) {

        var item, last, node, tag;

        view = control.view_content || view;

        if ((last = view.lastChild) && last.className === 'f-scroll')
        {
            tag = last;
            last = last.previousSibling;
        }

        for (var i = control.length - 1; i >= 0; i--)
        {
            if ((item = control[i]) && (node = item.view))
            {
                if (node !== last)
                {
                    view.insertBefore(node, tag || null);
                }

                last = (tag = node).previousSibling;
            }
        }
    };

 

    //销毁视图
    this.dispose = function (control) {

        var view = control.view,
            any;

        if (view)
        {
            if (any = view.parentNode)
            {
                any.removeChild(view);
            }

            this.unmount(control);

            view.innerHTML = '';
        }
    };




    //创建渲染器或给渲染器取别名
    flyingon.renderer = function (name, parent, fn) {

        if (!name)
        {
            throw 'renderer name not allow empty!'
        }

        if (typeof parent === 'function')
        {
            fn = parent;
            parent = '';
        }
        else if (typeof fn !== 'function') //给指定的类型绑定渲染器
        {
            return;
        }
        
        if (parent && (parent = registry_list[parent]))
        {
            fn.__parent = parent;
        }

        registry_list[fn.__name = name] = fn;
    };


    //绑定渲染器至目标对象
    flyingon.renderer.bind = function (target, name) {

        var renderer = registry_list[name];

        if (renderer && typeof renderer === 'function')
        {
            renderer = init_renderer(renderer);
        }

        if (renderer)
        {
            target.renderer = renderer;
        }
        else if (!target.renderer)
        {
            target.renderer = self;
        }
    };


    //初始化渲染器
    function init_renderer(fn) {

        var parent = fn.__parent,
            target,
            name;

        parent = parent && init_renderer(parent) || self;

        if (name = fn.__name)
        {
            target = flyingon.create(parent);
            fn.call(target, parent);

            return registry_list[name] = target;
        }
    };



}).call(flyingon.create(null));