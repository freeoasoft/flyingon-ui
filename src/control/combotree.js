flyingon.fragment('f-ComboTree', function () {



    //下拉框宽度
    this['popup-width'] = this.defineProperty('popupWidth', '');


    //下拉框高度
    this['popup-height'] = this.defineProperty('popupHeight', '');


    //树风格
    //default   默认风格
    //blue      蓝色风格
    //plus      加减风格
    //line      线条风格
    this.defineProperty('theme', '');


    //是否显示检查框
    this.defineProperty('checked', false);


    //是否显示图标
    this.defineProperty('icon', true);


});




flyingon.TextButton.extend('ComboTree', function (base) {


    
    var tree, cache; 



    this.__type = 'f-combotree-button';



    //扩展下拉框定义
    flyingon.fragment('f-ComboTree', this);



    //下拉数据
    this.defineProperty('data', null, { 
        
        set: function (name, value) {

            //转换成flyingon.DataList
            flyingon.DataList.create(value, this.__set_data, this);
        }
    });



    //重载获取文本方法
    this.text = this.__list_text;


    //重载是否多选方法
    this.__multi = function (storage) {

        return storage.checked;
    };



    //弹出日历窗口
    this.popup = this.__on_click = function () {

        var popup = this.__get_popup(),
            tree = cache || init_tree(),
            data = this.__data_list,
            storage = this.__storage || this.__defaults;

        tree.border(0)
            .theme(storage.theme)
            .checked(storage.checked)
            .icon(storage.icon)
            .width(storage.popupWidth)
            .height(storage.popupHeight);

        tree.splice(0);
        
        if (data)
        {
            tree.push.apply(tree, data);
        }
       
        popup.push(tree);
        popup.show(this);

        this.trigger('popup');
    };


    function init_tree() {

        return cache = new flyingon.Tree().on('change', function (e) {
            
            var target = tree;

            target.value(e.value);

            if (target.checked())
            {
                target.__get_popup().close();
            }

            target.trigger('change', 'value', e.value);
        });
    };



}).register();