//容器控件渲染器
flyingon.renderer('Box', function (base) {
    
    

    this.__scroll_html = '';



    //渲染html
    this.render = function (writer, control, render) {

        writer.push('<span');
        
        render.call(this, writer, control);
        
        writer.push('>');

        this.__render_children(writer, control, control, 0, control.length);

        writer.push('</span>');
    };



    this.mount = function (control, view) {

        base.mount.call(this, control, view);
        this.__mount_children(control, view, control, 0, control.length, view.firstChild);
    };


    this.unmount = function (control) {

        this.__unmount_children(control);
        base.unmount.call(this, control);
    };



});