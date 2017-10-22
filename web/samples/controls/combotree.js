flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: 'vertical-line',

        children: [
            {
                Class: 'Panel',
                width: 780,
                height: 60,

                children: [
                    {
                        Class: 'ComboTree',
                        data: 'test'
                    },
                    {
                        Class: 'ComboTree',
                        data: 'test',
                        value: '2'
                    },
                    {
                        Class: 'ComboTree',
                        checked: true,
                        items: 'test',
                        value: '2,3'
                    }
                ]
            },
            { Class: 'Code' }
        ]
    },

    created: function () {

        var data = [];

        for (var i = 1; i < 10; i++)
        {
            var children = [];
            
            for (var j = 1; j < 10; j++)
            {
                children.push({ value: i * 10 + j, text: 'text ' + i + ' ' + j });
            }
            
            data.push({ value: i, text: 'text ' + i, children: children });
        }

        new flyingon.DataList('value', 'text').load(data).register('test');
    }


});