flyingon.renderer('Hint', 'Label', function (base) {

    

    this.lineHeight = 1;
    


    this.render = function (writer, control, render) {

        var type = control.type();

        if (type !== 'text')
        {
            type += ' f-hint-icon'
        }

        writer.push('<span');
        
        render.call(this, writer, control);
        
        writer.push('><span class="f-hint-', type, '"></span></span>');
    };


    this.type = function (control, view, value) {

        var name = 'f-hint-' + value;

        view = view.firstChild;

        if (value !== 'text')
        {
            name = 'f-hint-icon ' + name;
            view.innerHTML = '';
        }

        view.className = name;
    };


    this.text = function (control, view, value) {

        view.firstChild.innerHTML = value;
    };


});