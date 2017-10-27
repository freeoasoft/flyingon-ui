flyingon.Control.extend('Title', function (base) {
   
    

    this.defaultWidth = 60;

    this.defaultHeight = 22;


    this.defaultValue('padding', '0 2');



    //是否标题控件
    this.__box_title = true;

    
    //文本内容
    this.defineProperty('text', '', {
        
        set: this.__render_text
    });


    //文本内容是否html格式
    this.defineProperty('html', false, {
        
        set: this.__render_text
    });


    //在box中是否独占一行
    this.defineProperty('line', false, {

        set: function (name, value) {

            if (value)
            {
                this.addClass('f-title-line');
            }
            else
            {
                this.removeClass('f-title-line');
            }
        }
    });



    //检测是否必填
    this.__check = function () {

        var parent = this.parent;

        if (parent)
        {
            for (var i = 0, l = parent.length; i < l; i++)
            {
                if (parent[i].__required)
                {
                    return true;
                }
            }
        }
    };



}).register();