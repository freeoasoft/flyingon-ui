//日历控件
flyingon.Control.extend('Calendar', function (base) {



    this.defaultWidth = this.defaultHeight = 240;


    this.defaultValue('border', 1);

    this.defaultValue('padding', 8);


    
    function render() {

        var patch = this.__view_patch;

        if (patch)
        {
            patch.update = true;
        }
        else
        {
            this.renderer.patch(this, 'update', true);
        }
    };


    //日期值
    this.defineProperty('value', null, {
        
        dataType: 'date',
        set: render
    });


    //最小可选值
    this.defineProperty('min', '', {
        
        set: render
    });


    //最大可选值
    this.defineProperty('max', '', {
        
        set: render
    });


    //是否编辑年月
    this.defineProperty('month', false, {
        
        set: render
    });


    //是否显示时间
    this.defineProperty('time', false, {
        
        set: render
    });


    //是否显示今天按钮
    this.defineProperty('today', false, {
        
        set: render
    });


    //是否显示清除按钮
    this.defineProperty('clear', false, {
        
        set: render
    });
    
    
    
}).register();