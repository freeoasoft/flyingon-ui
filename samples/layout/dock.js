flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: 'vertical-line',

        children: [

            {
                Class: 'Panel',
                className: 'f-border',
                width: 780,
                height: 300,
                border: 1,
                padding: 8,
                resizable: true,
                layout: 'dock',

                children: [

                    { Class: 'Panel', className: 'f-border', dock: 'top', height: 60 },
                    { Class: 'Splitter', className: 'f-back', dock: 'top' },
                    { Class: 'Panel', className: 'f-border', dock: 'bottom', height: 60 },
                    { Class: 'Splitter', className: 'f-back', dock: 'bottom' },
                    { Class: 'Panel', className: 'f-border', dock: 'left', width: 60 },
                    { Class: 'Splitter', className: 'f-back', dock: 'left' },
                    { Class: 'Panel', className: 'f-border', dock: 'right', width: 60 },
                    { Class: 'Splitter', className: 'f-back', dock: 'right' },
                    // { Class: 'Panel', className: 'f-border', dock: 'fill' }
                    { Class: 'Grid', className: 'f-border', dock: 'fill', columns: [
                        { name: 'F1', title: 'F1', type: 'checkbox' },
                        { name: 'F2', title: 'F2', type: 'textbox', align: 'right' },
                        { name: 'F3', title: 'F3', type: 'number', digits: 2, format: '¥{0}', button: 'none', align: 'right' },
                        { name: 'F4', title: 'F4', type: 'date' },
                        { name: 'F5', title: 'F5', type: 'time' },
                        { name: 'F6', title: 'F6', type: 'combobox', checked: 'checkbox', popupWidth: 100 },
                        { name: 'F7', title: 'F7', type: 'textbox' },
                        { name: 'F8', title: 'F8', type: 'textbox' },
                        { name: 'F9', title: 'F9', type: 'textbox' },
                        { name: 'F10', title: 'F10', type: 'textbox' }
                    ]}
                ]
            },
            
            {
                Class: 'Label',
                margin: '4 0',
                text: '提醒:可拖动调整面板大小'
            },

            { Class: 'Code' }
        ]
    },

    created: function () {

    }


});