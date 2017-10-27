//集合功能扩展
flyingon.fragment('f-container', function (base, childrenClass) {



    //子控件类
    this.childrenClass = childrenClass || flyingon.Control;



    flyingon.fragment('f-collection', this);


    //分离子控件(不销毁)
    this.detach = function (index, length) {

        var items = this.splice.apply(this, arguments),
            length = items.length,
            item;

        if (length > 0)
        {
            for (var i = 0; i < length; i++)
            {
                if (item = items[i])
                {
                    item.parent = null;
                    item.autoDispose = false;
                }
            }
        }

        return items;
    };



    this.__check_error = function (Class) {

        throw '"' + this.Class.fullName + '" type can push "' + Class.fullName + '" type only!';
    };


    //创建控件方法
    this.__create_child = flyingon.ui;


    //添加子项前检测处理
    this.__check_items = function (index, items, start) {

        var Class = this.childrenClass,
            patch = this.__content_render && [],
            locate = this.__locate_host,
            item,
            any;

        while (item = items[start])
        {
            if (item.__flyingon_class)
            {
                if (item instanceof Class)
                {
                    if (any = item.parent)
                    {
                        any.__remove_items(any.indexOf(item), [item]);
                    }
                }
                else
                {
                    this.__check_error(Class);
                }
            }
            else if ((item = this.__create_child(item, Class)) instanceof Class)
            {
                items[start] = item;
            }
            else
            {
                this.__check_error(Class);
            }

            item.parent = this;

            //标记是否定位
            item.__is_locate = locate;

            if (any = item.onparentchanged)
            {
                any.call(item, this);
            }

            if (patch)
            {
                patch.push(item);
            }

            start++;
        }

        if (patch && patch[0])
        {
            this.__children_dirty(1, index, patch);
        }

        this.__update_dirty < 2 && this.__arrange_delay(2);
    };


    //移除多个子项
    this.__remove_items = function (index, items) {

        var patch = [],
            item,
            any;

        for (var i = items.length - 1; i >= 0; i--)
        {
            if (item = items[i])
            {
                if (any = item.onparentchanged)
                {
                    any.call(item, null);
                }

                item.parent = null;
                item.autoDispose = true;
                item.__is_locate = false;

                patch.push(item);
            }
        }

        //注册子项变更补丁
        if (patch[0])
        {
            this.__children_dirty(2, -1, patch);
        }

        this.__update_dirty < 2 && this.__arrange_delay(2);
    };


    //注册子项变更补丁
    this.__children_dirty = function (type, index, items) {

        var patch = this.__children_patch;

        if (patch)
        {
            var any = patch.length - 3;

            //相同类型进行合并处理
            if (type === patch[any++] && patch[any++] === index)
            {
                any = patch[any + 1];
                any.apply(any, items);
            }
            else
            {
                patch.push(type, index, items);
            }
        }
        else
        {
            this.__children_patch = [type, index, items];
            this.renderer.__children_dirty(this);
        }
    };



    //默认不处理排列
    this.__update_dirty = 2;


    //启用延时排列
    this.__arrange_delay = function (dirty) {

        var parent = this.parent;

        this.__update_dirty = dirty;

        if (parent)
        {
            dirty = this.__auto_width || this.__auto_height ? 2 : 1;

            if (parent.__update_dirty < dirty)
            {
                parent.__arrange_delay(dirty);
            }
        }
    };



    //使用选择器查找子控件
    this.find = function (selector) {

        return new flyingon.Query(selector, [this]);
    };


    //查找指定id的子控件
    this.findById = function (id, deep) {

        var query = new flyingon.Query(),
            list;

        if (id)
        {
            list = flyingon.__find_id(deep !== false ? this.all() : this, id);
            list.push.apply(query, list);
        }

        return query;
    };


    //查找指定类型的子控件
    this.findByType = function (name, deep) {

        var query = new flyingon.Query(),
            list;

        if (name)
        {
            list = flyingon.__find_type(deep !== false ? this.all() : this, name);
            list.push.apply(query, list);
        }

        return query;
    };


    //查找指定class的子控件
    this.findByClass = function (name, deep) {

        var query = new flyingon.Query(),
            list;

        if (name)
        {
            list = flyingon.__find_class(deep !== false ? this.all() : this, name);
            list.push.apply(query, list);
        }

        return query;
    };


    //获取所有子控件
    this.all = function (list) {

        var item;

        list = list || [];

        for (var i = 0, l = this.length; i < l; i++)
        {
            if (item = this[i])
            {
                list.push(item);

                if (item.length > 0)
                {
                    item.all(list);
                }
            }
        }

        return list;
    };



    //如果子项是控件则生成检验和数据变更处理方法
    if (!childrenClass || childrenClass.prototype instanceof flyingon.Control)
    {

        //排列时生成校验方法
        this.__validate = function (errors, show) {

            var item, fn;

            for (var i = 0, l = this.length; i < l; i++)
            {
                if ((item = this[i]) && (fn = item.__validate))
                {
                    fn.call(item, errors, show);
                }
            }
        };
        
    

        //接收数据集变更动作处理
        this.subscribeBind = function (dataset, action) {
            
            var item;
            
            base && base.subscribeBind.call(this, dataset, action);

            //向下派发
            for (var i = 0, l = this.length; i < l; i++)
            {
                if ((item = this[i]) && !item.__dataset)
                {
                    item.subscribeBind(dataset, action);
                }
            }
            
            return this;
        };
        
    }



    this.serialize = function (writer) {
        
        base && base.serialize.call(this, writer);
        
        if (this.length > 0)
        {
            writer.writeProperty('children', this, true);
        }
        
        return this;
    };
    

    this.deserialize_children = function (reader, values) {
      
        if (typeof values === 'function')
        {
            var any = [];

            values(any); //values(values = []); 在IE7下会出错
            values = any;
        }

        this.push.apply(this, reader.readArray(values, this.childrenClass));
    };


    this.dispose = function () {

        for (var i = this.length - 1; i >= 0; i--)
        {
            this[i].dispose(false);
        }

        if (base)
        {
            base.dispose.apply(this, arguments);
        }
        else if (this.__events)
        {
            this.off();
        }

        return this;
    };


});