/**
 * @class flyingon.Panel
 * @extends flyingon.Control
 * @description 面板容器类
 */
flyingon.Control.extend('Panel', function (base) {



    var Panel = flyingon.Panel;



    //重写默认宽度
    this.defaultWidth = 300;
    
    //重写默认高度
    this.defaultHeight = 150;



    //重写默认为可放置移动或拖动对象
    this.defaultValue('droppable', true);



    //当前布局
    this.defineProperty('layout', null, {
     
        group: 'layout',
        set: function (name, value) {

            this.__layout = null;
            this.view && this.renderer.layout(this, value);
        }
    });

    

    //扩展容器功能
    flyingon.fragment('f-container', this, base);



    //是否定位宿主
    this.__locate_host = true;
    
    
    //使布局无效
    this.update = function () {

        var parent = this.parent;

        this.__update_dirty = 2;

        if (parent)
        {            
            var dirty = this.__auto_width || this.__auto_height ? 2 : 1;

            if (parent.__update_dirty < dirty)
            {
                parent.__arrange_delay(dirty);
            }
        }
        else if (this.__top_control)
        {
            flyingon.__update_delay(this);
        }

        return this;
    };


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
        else if (this.__top_control)
        {
            flyingon.__update_delay(this);
        }
    };

    
    //测量自动大小
    this.onmeasure = function () {
        
        var tag = (this.offsetHeight << 16) + this.offsetWidth,
            autoWidth = this.__auto_width,
            autoHeight = this.__auto_height;

        if (this.__size_tag !== tag)
        {
            this.__size_tag = tag;
            this.__update_dirty = 2;
        }

        if (autoWidth || autoHeight)
        {
            this.renderer.locate(this);

            if (autoWidth)
            {
                this.offsetWidth = this.arrangeRight + this.borderLeft + this.borderRight;
            }
            
            if (autoHeight)
            {
                this.offsetHeight = this.arrangeBottom + this.borderTop + this.borderBottom;
            }
        }
        else
        {
            return false;
        }
    };


    this.onparentchanged = function (parent) {

        if (parent && !(parent instanceof Panel))
        {
            throw 'Panel can only be used as the child node of Panel';
        }
    };


}).register();