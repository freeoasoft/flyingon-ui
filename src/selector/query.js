
//选择器查询类
flyingon.Query = Object.extend(function () {
    
    

    //选择数量
    this.length = 0;
    

    
    this.init = function (selector, control) {
       
        var view = control ? control.view : document,
            nodes;

        if (view && (nodes = view.querySelectorAll(selector)) && nodes[0])
        {
            var uniqueId = flyingon.__uniqueId,
                length = 0,
                any;

            for (var i = 0, l = nodes.length; i < l; i++)
            {
                if ((any = nodes[i].flyingon_id) && (any = uniqueId[any]))
                {
                    this[length++] = any;
                }
            }
        }
    };
        
  

    this.on = function (type, fn) {

        if (type && fn)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.on(type, fn);
            }
        }
        
        return this;
    };
    
    
    this.once = function (type, fn) {

        if (type && fn)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.once(type, fn);
            }
        }
        
        return this;
    };

    
    this.off = function (type, fn) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.off(type, fn);
        }
        
        return this;
    };


    this.trigger = function (e) {

        if (e)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.trigger.apply(item, arguments);
            }
        }
        
        return this;
    };

    

    this.hasClass = function (className) {

        var item;
        return className && (item = this[0]) ? item.hasClass(className) : false;
    };

    
    this.addClass = function (className) {

        if (className)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.addClass(className);
            }
        }
        
        return this;
    };

    
    this.removeClass = function (className) {

        if (className)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.removeClass(className);
            }
        }
        
        return this;
    };

    
    this.toggleClass = function (className) {

        if (className)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.toggleClass(className);
            }
        }
        
        return this;
    };


    this.get = function (name) {

        var item = name && item[0];
        return item && item.get(name);
    };


    this.set = function (name, value) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                item.set(name, value);
            }
        }
        
        return this;
    };

    
    
}, false);