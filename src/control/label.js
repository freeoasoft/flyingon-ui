flyingon.Control.extend('Label', function (base) {
   
    

    this.defaultWidth = 60;


    
    //标签文本
    this.defineProperty('text', '', {
        
        set: this.__render_text
    });


    //文本是否html
    this.defineProperty('html', false, {
        
        set: this.__render_text
    });


    
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