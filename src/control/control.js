
/**
 * @class flyingon.Control
 * @uses f-bindable
 * @uses f-collection
 * @description 控件基类
 */
//IE7点击滚动条时修改className会造成滚动条无法拖动,需在改变className后设置focus获取焦点解决此问题
Object.extend('Control', function () {

    
    
    var create = flyingon.create;
  
    var pixel = flyingon.pixel;

    var pixel_sides = flyingon.pixel_sides;




    this.defaultWidth = 100;

    this.defaultHeight = 25;


    //更新状态
    this.__update_dirty = 0;


    
    //扩展可视组件功能
    flyingon.fragment('f-visual', this);

    
    //扩展可绑定功能
    flyingon.fragment('f-bindable', this);
    


    //获取焦点指令
    this['#focused'] = function (value) {

        if (value)
        {
            this.focus();
        }
        else
        {
            this.blur();
        }
    };



    //渲染指定属性值
    this.render = function (name, value, oldValue) {

        var patch = this.__view_patch;
        
        if (patch)
        {
            patch[name] = value;
        }
        else
        {
            this.renderer.patch(this, name, value);
        }
    };


    //渲染文本方法
    this.__render_text = function () {

        var patch = this.__view_patch;
        
        if (patch)
        {
            patch.text = true;
        }
        else
        {
            this.renderer.patch(this, 'text', true);
        }
    };


    //渲染值方法
    this.__render_value = function () {

        var patch = this.__view_patch;
        
        if (patch)
        {
            patch.value = true;
        }
        else
        {
            this.renderer.patch(this, 'value', true);
        }
    };


    //生成指定名称的渲染方法
    this.__render_fn = function (name) {

        return function (name, value) {

            var patch = this.__view_patch;
            
            if (patch)
            {
                patch[name] = value;
            }
            else
            {
                this.renderer.patch(this, name, value);
            }
        };
    };



    /**
     * @method visible
     * @description 是否可见
     * @param {boolean} value
     */
    this.defineProperty('visible', this.__visible = true, {
        
        group: 'layout',

        set: function (name, value) {

            var any;

            this.__visible = value;
            
            if (this.view)
            {
                if (any = this.__view_patch)
                {
                    any[name] = value;
                }
                else
                {
                    this.renderer.patch(this, name, value);

                    if ((any = this.parent) && any.__update_dirty < 2)
                    {
                        any.__arrange_delay(2);
                    }
                }
            }
        }
        
    }, false);
        


    var set = function (name, value) {

        var any = this.__locate_patch;
        
        if (any)
        {
            any[name] = value;
        }
        else
        {
            (this.__locate_patch = {})[name] = value;
        
            if (this.view && !this.__delay_patch)
            {
                flyingon.__register_delay(this);
            }

            if ((any = this.parent) && any.__update_dirty < 2)
            {
                any.__arrange_delay(2);
            }
        }
    };

    
    //外边距
    this.defineProperty('margin', '', {
            
        group: 'layout',
        set: set

    }, false);


    //边框宽度
    this.defineProperty('border', '', {
            
        group: 'layout',
        set: set

    }, false);


    //内边距
    this.defineProperty('padding', '', {
            
        group: 'layout',
        set: set

    }, false);


    //左边距
    this.defineProperty('left', '', {
            
        group: 'layout',
        set: set

    }, false);


    //顶边距
    this.defineProperty('top', '', {
            
        group: 'layout',
        set: set

    }, false);


    //最小宽度
    this['min-width'] = this.defineProperty('minWidth', '', {
            
        group: 'layout',
        set: set

    }, false);


    //最大宽度
    this['max-width'] = this.defineProperty('maxWidth', '', {
            
        group: 'layout',
        set: set

    }, false);


    //最小高度
    this['min-height'] = this.defineProperty('minHeight', '', {
            
        group: 'layout',
        set: set

    }, false);


    //最大高度
    this['max-height'] = this.defineProperty('maxHeight', '', {
            
        group: 'layout',
        set: set

    }, false);


    //水平方向超出内容时显示方式
    this['overflow-x'] = this.defineProperty('overflowX', 'auto', {

        group: 'layout',
        set: set

    }, false);
      
    
    //竖直方向超出内容时显示方式
    this['overflow-y'] = this.defineProperty('overflowY', 'auto', {

        group: 'layout',
        set: set

    }, false);


    set = function (name, value) {

        var any = this.__locate_patch;
        
        this['__auto_' + name] = value === 'auto';

        if (any)
        {
            any[name] = value;
        }
        else
        {
            (this.__locate_patch = {})[name] = value;

            if (this.view && !this.__delay_patch)
            {
                flyingon.__register_delay(this);
            }
        
            if ((any = this.parent) && any.__update_dirty < 2)
            {
                any.__arrange_delay(2);
            }
        }
    };

    
    //宽度
    //'': 默认
    //auto: 自动
    //number: 指定象素
    //number + css单位
    this.defineProperty('width', '', {
            
        group: 'layout',
        set: set

    }, false);


    //高度
    //'': 默认
    //auto: 自动
    //number: 指定象素
    //number + css单位
    this.defineProperty('height', '', {
            
        group: 'layout',
        set: set

    }, false);



    set = function () {

        var any;
        
        if ((any = this.parent) && any.__update_dirty < 2)
        {
            any.__arrange_delay(2);
        }
    };


    //控件横向对齐方式
    //left      左边对齐
    //center    横向居中对齐
    //right     右边对齐
    this['align-x'] = this.defineProperty('alignX', 'left', {

        group: 'layout',
        set: set
    }, false);


    //控件纵向对齐方式
    //top       顶部对齐
    //middle    纵向居中对齐
    //bottom    底部对齐
    this['align-y'] = this.defineProperty('alignY', 'top', {

        group: 'layout',
        set: set
    }, false);

    
    //控件停靠方式(此值仅在当前布局类型为停靠布局(dock)时有效)
    //left:     左停靠
    //top:      顶部停靠
    //right:    右停靠
    //bottom:   底部停靠
    //fill:     充满
    this.defineProperty('dock', 'left', {

        group: 'layout',
        set: set
    }, false);




    //创建样式
    function style(self, name) {

        var key = name.replace(/-(\w)/g, function (_, x) {
        
            return x.toUpperCase();
        });
        
        return self[key] = self.defineProperty(name, '', {

            group: 'appearance',

            set: function (name, value) {

                var any = this.__style_patch;
                
                if (any)
                {
                    any[name] = value;
                }
                else
                {
                    this.renderer.style(this, name, value);
                }
            }

        }, false);
    };



    //定位方式
    style(this, 'position');


    //显示方式
    style(this, 'display');


    //浮动
    this['float'] = style(this, 'cssFloat');
    

    //清除浮动
    style(this, 'clear');


    //行高
    style(this, 'line-height');



    //控件层叠顺序
    style(this, 'z-index');

    
    //控件上右下左边框样式
    style(this, 'border-style');


    //控件上右下左边框颜色
    style(this, 'border-color');


    //控件上右下左边框圆角
    style(this, 'border-radius');


    //阅读方向
    //ltr	    从左到右 
    //rtl	    从右到左 
    style(this, 'direction');


    //控件内容横向对齐样式
    //left      左边对齐
    //center    横向居中对齐
    //right     右边对齐
    style(this, 'text-align');

    //控件内容纵向对齐样式
    //top       顶部对齐
    //middle    纵向居中对齐
    //bottom    底部对齐
    style(this, 'vertical-align');



    //控件可见性
    //visible	默认值 元素是可见的 
    //hidden	元素是不可见的 
    style(this, 'visibility');

    //控件透明度
    //number	0(完全透明)到1(完全不透明)之间数值
    style(this, 'opacity');

    //控件光标样式
    //url	    需使用的自定义光标的 URL     注释：请在此列表的末端始终定义一种普通的光标, 以防没有由 URL 定义的可用光标 
    //default	默认光标(通常是一个箭头)
    //auto	    默认 浏览器设置的光标 
    //crosshair	光标呈现为十字线 
    //pointer	光标呈现为指示链接的指针(一只手)
    //move	    此光标指示某对象可被移动 
    //e-resize	此光标指示矩形框的边缘可被向右(东)移动 
    //ne-resize	此光标指示矩形框的边缘可被向上及向右移动(北/东) 
    //nw-resize	此光标指示矩形框的边缘可被向上及向左移动(北/西) 
    //n-resize	此光标指示矩形框的边缘可被向上(北)移动 
    //se-resize	此光标指示矩形框的边缘可被向下及向右移动(南/东) 
    //sw-resize	此光标指示矩形框的边缘可被向下及向左移动(南/西) 
    //s-resize	此光标指示矩形框的边缘可被向下移动(南) 
    //w-resize	此光标指示矩形框的边缘可被向左移动(西) 
    //text	    此光标指示文本 
    //wait	    此光标指示程序正忙(通常是一只表或沙漏) 
    //help	    此光标指示可用的帮助(通常是一个问号或一个气球) 
    style(this, 'cursor');


    //控件背景颜色
    //color_name	规定颜色值为颜色名称的背景颜色(比如 red)  transparent:透明 
    //hex_number	规定颜色值为十六进制值的背景颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的背景颜色(比如 rgb(255,0,0)) 
    style(this, 'background-color');

    //控件背景图片
    //string        图像名(空字符串则表示无背景)
    //url('URL')	指向图像的路径
    style(this, 'background-image');

    //控件背景重复方式
    //repeat	背景图像将在垂直方向和水平方向重复 
    //repeat-x	背景图像将在水平方向重复 
    //repeat-y	背景图像将在垂直方向重复 
    //no-repeat	背景图像将仅显示一次 
    style(this, 'background-repeat');

    //控件背景颜色对齐方式
    //top left
    //top center
    //top right
    //center left
    //center center
    //center right
    //bottom left
    //bottom center
    //bottom right  如果您仅规定了一个关键词, 那么第二个值将是'center'     默认值：0% 0% 
    //x% y%	        第一个值是水平位置, 第二个值是垂直位置     左上角是 0% 0% 右下角是 100% 100%     如果您仅规定了一个值, 另一个值将是 50% 
    //xpos ypos	    第一个值是水平位置, 第二个值是垂直位置     左上角是 0 0 单位是像素 (0px 0px) 或任何其他的 CSS 单位     如果您仅规定了一个值, 另一个值将是50%     您可以混合使用 % 和 position 值 
    style(this, 'background-position');


    //控件颜色
    //color_name	规定颜色值为颜色名称的颜色(比如 red) 
    //hex_number	规定颜色值为十六进制值的颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的颜色(比如 rgb(255,0,0)) 
    style(this, 'color');


    //控件字体样式
    //normal	浏览器显示一个标准的字体样式 
    //italic	浏览器会显示一个斜体的字体样式 
    //oblique	浏览器会显示一个倾斜的字体样式 
    style(this, 'font-style');

    //控件字体变体
    //normal	    浏览器会显示一个标准的字体 
    //small-caps	浏览器会显示小型大写字母的字体 
    style(this, 'font-variant');

    //控件字体粗细
    //normal	定义标准的字符 
    //bold	    定义粗体字符 
    //bolder	定义更粗的字符 
    //lighter	定义更细的字符 
    //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
    style(this, 'font-weight');

    //控件字体大小
    style(this, 'font-size');

    //控件文字行高
    style(this, 'line-height');

    //控件字体族 family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表
    style(this, 'font-family');



    //控件文字词间距(以空格为准)
    style(this, 'word-spacing');

    //控件文字字间距
    style(this, 'letter-spacing');

    //控件文字缩进
    style(this, 'text-indent');

    //控件文字装饰
    //none	        默认 定义标准的文本 
    //underline	    定义文本下的一条线 
    //overline	    定义文本上的一条线 
    //line-through	定义穿过文本下的一条线 
    //blink	        定义闪烁的文本 
    style(this, 'text-decoration');

    //控件文字溢出处理方式
    //clip	    修剪文本
    //ellipsis	显示省略符号来代表被修剪的文本 	
    //string	使用给定的字符串来代表被修剪的文本 
    style(this, 'text-overflow');


    //转换
    style(this, 'transform');

    //过渡
    style(this, 'transition');

    //动画
    style(this, 'animation');

    


    //是否禁用
    this.defineProperty('disabled', false, {

        set: this.render

    }, false);
    

    //tab顺序
    this.defineProperty('tabindex', 0, {

        set: this.render

    }, false);
    
    
    //提示信息
    this.defineProperty('title', '', {

        set: this.render   
    }, false);


    //快捷键
    this.defineProperty('accesskey', '', {

        set: this.render

    }, false);
    
    
    
    //是否可调整大小或调整大小的方式
    //none  不可调整
    //x     只能调整宽度
    //y     只能调整高度
    //all   宽度高度都可调整
    this.defineProperty('resizable', 'none');
    
    

    //自定义标记键值
    this.defineProperty('key', '');


    //自定义标记
    this.defineProperty('tag', null);


    //弹出菜单
    this.defineProperty('contextmenu', null);




    //获取定位属性值
    this.locationValue = function (name) {

        return (this.__location_values || this.__storage || this.__defaults)[name];
    };


    

    //测量控件大小
    //containerWidth    容器宽度
    //containerHeight   容器高度
    //availableWidth    可用宽度 
    //availableHeight   可用高度
    //defaultToFill     默认宽度或高度是否转成充满 0:不转 1:宽度转 2:高度转 3:宽高都转
    this.measure = function (containerWidth, containerHeight, availableWidth, availableHeight, defaultToFill) {
        
        var storage = this.__storage || this.__defaults,
            location = this.__location_values || storage,
            minWidth = location.minWidth,
            maxWidth = location.maxWidth,
            minHeight = location.minHeight,
            maxHeight = location.maxHeight,
            width = location.width,
            height = location.height,
            fn = pixel_sides,
            cache = fn.cache,
            any;

        any = cache[any = location.margin] || fn(any, containerWidth);

        this.marginLeft = any.left;
        this.marginTop = any.top;
        this.marginRight = any.right;
        this.marginBottom = any.bottom;

        //不支持在布局中修改边框和内边距
        any = cache[any = storage.border] || fn(any, 0); //border不支持百分比

        this.borderLeft = any.left;
        this.borderTop = any.top;
        this.borderRight = any.right;
        this.borderBottom = any.bottom;

        //不支持在布局中修改边框和内边距
        any = cache[any = storage.padding] || fn(any, containerWidth);

        this.paddingLeft = any.left;
        this.paddingTop = any.top;
        this.paddingRight = any.right;
        this.paddingBottom = any.bottom;

        fn = pixel;
        cache = fn.cache;

        minWidth = minWidth > 0 ? minWidth | 0 : cache[minWidth] || fn(minWidth, containerWidth);
        maxWidth = maxWidth > 0 ? maxWidth | 0 : cache[maxWidth] || fn(maxWidth, containerWidth);

        minHeight = minHeight > 0 ? minHeight | 0 : cache[minHeight] || fn(minHeight, containerHeight);
        maxHeight = maxHeight > 0 ? maxHeight | 0 : cache[maxHeight] || fn(maxHeight, containerHeight);

        //处理宽度
        switch (width)
        {
            case '':
                if (defaultToFill & 1)
                {
                    any = availableWidth >= 0 ? availableWidth : containerWidth;
                    width = any - this.marginLeft - this.marginRight;
                }
                else
                {
                    width = this.defaultWidth;
                }
                break;
                
            case 'auto':
                width = availableWidth || this.defaultWidth;
                break;

            default:
                width = (any = +width) === any ? any | 0 : cache[width] || fn(width, containerWidth);
                break;
        }

        if (any < 0)
        {
            width = 0;
        }

        //处理高度
        switch (height)
        {
            case '':
                if (defaultToFill & 2)
                {
                    any = availableHeight >= 0 ? availableHeight : containerHeight;
                    height = any - this.marginTop - this.marginBottom;
                }
                else
                {
                    height = this.defaultHeight;
                }
                break;
                
            case 'auto':
                height = availableHeight || this.defaultHeight;
                break;

            default:
                height = (any = +height) === any ? any | 0 : cache[height] || fn(height, containerHeight);
                break;
        }

        if (height < 0)
        {
            height = 0;
        }

        //处理最小及最大宽度
        if (width < minWidth)
        {
            width = minWidth;
        }
        else if (maxWidth > 0 && width > maxWidth)
        {
            width = maxWidth;
        }
        
        //处理最小及最大高度
        if (height < minHeight)
        {
            height = minHeight;
        }
        else if (maxHeight > 0 && height > maxHeight)
        {
            height = maxHeight;
        }
        
        //设置大小
        this.offsetWidth = width;
        this.offsetHeight = height;
        
        //测量后处理
        if ((fn = this.onmeasure) && fn.call(this) !== false)
        {
            //处理最小及最大宽度
            if (this.offsetWidth !== width)
            {
                if ((width = this.offsetWidth) < minWidth)
                {
                    this.offsetWidth = width = minWidth;
                }
                else if (maxWidth > 0 && width > maxWidth)
                {
                    this.offsetWidth = width = maxWidth;
                }
            }

            //处理最小及最大高度
            if (this.offsetHeight !== height)
            {
                if ((height = this.offsetHeight) < minHeight)
                {
                    this.offsetHeight = height = minHeight;
                }
                else if (maxHeight > 0 && height > maxHeight)
                {
                    this.offsetHeight = height = maxHeight;
                }
            }
        }
    };
    
        
    //定位控件
    this.locate = function (x, y, alignWidth, alignHeight, container) {
        
        var width = this.offsetWidth,
            height = this.offsetHeight,
            any;

        if (alignWidth > 0 && (any = alignWidth - width))
        {
            switch ((this.__location_values || this.__storage || this.__defaults).alignX)
            {
                case 'center':
                    x += any >> 1;
                    break;

                case 'right':
                    x += any;
                    break;
                    
                default:
                    x += this.marginLeft;
                    break;
            }
        }
        else
        {
            x += this.marginLeft;
        }

        if (alignHeight > 0 && (any = alignHeight - height))
        {
            switch ((this.__location_values || this.__storage || this.__defaults).alignY)
            {
                case 'middle':
                    y += any >> 1;
                    break;

                case 'bottom':
                    y += any;
                    break;
                    
                default:
                    y += this.marginTop;
                    break;
            }
        }
        else
        {
            y += this.marginTop;
        }
        
        this.offsetLeft = x;
        this.offsetTop = y;
        
        if ((any = this.onlocate) && any.call(this) !== false)
        {
            x = this.offsetLeft;
            y = this.offsetTop;
        }

        if (container)
        {
            container.arrangeX = (x += width + this.marginRight);
            container.arrangeY = (y += height + this.marginBottom);

            if (x > container.arrangeRight)
            {
                container.arrangeRight = x;
            }

            if (y > container.arrangeBottom)
            {
                container.arrangeBottom = y;
            }
        }
    };
    


    this.focus = function () {

        this.view && this.renderer.focus(this);
    };


    this.blur = function () {

        this.view && this.renderer.blur(this);
    };
    
           
      
    //显示或关闭加载进度
    this.loading = function (delay) {

        loading(this, 'f-loading', delay);
    };


    //显示或关闭等待信息
    this.waiting = function (delay) {

        loading(this, 'f-waiting', delay);
    };


    function loading(control, name, delay) {

        if (delay === false)
        {
            control.removeClass(name);
        }
        else if (delay > 0)
        {
            setTimeout(function () {

                control.removeClass(name);

            }, delay | 0);
        }
        else
        {
            control.addClass(name);
        }
    };


    
    //扩展可序列化功能
    flyingon.fragment('f-serialize', this);


    
    //序列化方法
    this.serialize = function (writer) {

        var any;
        
        if ((any = this.Class) && (any = any.nickName || any.fullName))
        {
            writer.writeProperty('Class', any);
        }
        
        if (any = this.__storage)
        {
            writer.writeProperties(any, this.getOwnPropertyNames(), this.__watches);
        }
    };

    

    //被移除或关闭时是否自动销毁
    this.autoDispose = true;
    
    
    //销毁控件    
    this.dispose = function () {
    
        var storage = this.__storage,
            any;

        //触发销毁过程
        if (any = this.ondistroyed)
        {
            any.call(this);
        }
        
        if (this.view)
        {
            this.renderer.dispose(this);
        }

        if (any = this.__dataset)
        {
            any.subscribe(this, true);
            this.__dataset = null;
        }
        
        if (this.__events)
        {
            this.off();
        }
        
        this.parent = this.__loop_vm = this.__list = null;

        return this;
    };
    
    

}).register();