flyingon.Control.extend('Box', function (base) {



    this.defaultWidth = 200;


    this.defaultHeight = 30;


    this.defaultValue('padding', 4);




    //标记是否检验容器
    this.__validate_box = true;



    //是否竖直排列
    this.defineProperty('vertical', false);



    //扩展容器功能
    flyingon.fragment('f-container', this, base);




    //设置或清除检验信息
    this.__set_validate = function (error, control) {

        var any = this.__find_error();

        if (any)
        {
            any.__validate_text = error ? error.text : '';
            any.visible(!!error);

            if (error && !any.__no_text)
            {
                any.renderer.patch(any, 'text', error.text);
            }

            if ((any = this.parent) && any.__update_dirty < 2)
            {
                any.__arrange_delay(2);
            }
        }
        else if (control)
        {
            control.__set_validate(error);
        }
    };



    //获取错误提醒控件
    this.__find_error = function () {

        for (var i = this.length - 1; i >= 0; i--)
        {
            if (this[i].__box_error)
            {
                return this[i];
            }
        }
    };



    //获取标题控件
    this.__find_title = function () {

        for (var i = 0, l = this.length; i < l; i++)
        {
            if (this[i].__box_title)
            {
                return this[i];
            }
        }
    };


    //获取错误标题信息
    this.__error_title = function (control) {

        var any;

        control = this.__find_title();

        return control && (any = control.__storage) ? any.text : '';
    };



    //测量自动大小
    this.onmeasure = function () {

        var autoWidth = this.__auto_width,
            autoHeight = this.__auto_height;

        if (autoWidth || autoHeight)
        {
            this.renderer.__measure_auto(this, autoWidth, autoHeight);
        }
        else
        {
            return false;
        }
    };

    

}).register();