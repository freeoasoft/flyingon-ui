/**
 * 下拉框基本属性(同时给下拉框及表格下拉列使用)
 */
flyingon.fragment('f-ComboBox', function () {



    //选中类型
    //none
    //radio
    //checkbox
    this.defineProperty('checked', 'none');



    //指定渲染列数
    //0     在同一行按平均宽度渲染
    //大于0 按指定的列数渲染
    this.defineProperty('columns', 1);


    //是否生成清除项
    this.defineProperty('clear', false);


    //子项模板
    this.defineProperty('template', null);


    //子项高度
    this['item-height'] = this.defineProperty('itemHeight', 21);


    //下拉框宽度
    this['popup-width'] = this.defineProperty('popupWidth', '');


    //最大显示项数量
    this['max-items'] = this.defineProperty('maxItems', 10);


    //多值时的分隔符
    this.defineProperty('separator', ',');


});



flyingon.TextButton.extend('ComboBox', function (base) {


    
    var combobox, cache;



    this.__type = 'f-combobox-button';



    //扩展下拉框定义
    flyingon.fragment('f-ComboBox', this);



    //下拉列表
    this.defineProperty('items', null, { 
        
        set: function (name, value) {

            //转换成flyingon.DataList
            flyingon.DataList.create(value, this.__set_data, this);
        }
    });



    //重载获取文本方法
    this.text = this.__list_text;


    //重载是否多选方法
    this.__multi = function (storage) {

        return storage.checked === 'checkbox';
    };



    //弹出日历窗口
    this.popup = this.__on_click = function () {

        var popup = this.__get_popup(),
            listbox = cache || init_listbox(),
            data = this.__data_list,
            storage = this.__storage || this.__defaults,
            columns = storage.columns,
            height = storage.itemHeight,
            length;

        listbox.border(0)
            .checked(storage.checked)
            .columns(columns)
            .clear(storage.clear)
            .template(storage.template)
            .itemHeight(height)
            .width(storage.popupWidth)
            .separator(storage.separator)
            .items(data || [])
            .value(storage.value);

        if (columns > 0)
        {
            length = data ? data.length : 0;

            if (storage.clear)
            {
                length++;
            }

            length = Math.min(length, storage.maxItems);

            if (columns > 1)
            {
                length = (length + columns - 1) / columns | 0;
            }

            height *= length;
        }

        combobox = this;
        listbox.height(height + 2);

        popup.push(listbox);
        popup.show(this);

        this.trigger('popup');
    };


    function init_listbox() {

        return cache = new flyingon.ListBox().on('change', function (e) {
            
            var target = combobox;

            target.value(e.value);

            if (target.checked() !== 'checkbox')
            {
                target.__get_popup().close();
            }

            target.trigger('change', 'value', e.value);
        });
    };



}).register();