//Ajax类
flyingon.Ajax = flyingon.Async.extend(function () {

    
    
    //请求的url
    this.url = '';
    
    //指定版本号
    this.version = '';

    //method
    this.method = 'GET';

    //text || json || xml
    this.dataType = 'text';

    //内容类型
    this.contentType = 'application/x-www-form-urlencoded';

    //自定义http头
    this.header = null;
    
    //是否异步
    this.async = true;
        
    //是否支持跨域资源共享(CORS)
    this.CORS = false;
    
    //超时时间
    this.timeout = 0;
    

    
    this.send = function (url, options) {

        var list = [], //自定义参数列表
            data, 
            get,
            any;
        
        if (options)
        {
            for (var name in options)
            {
                if (name !== 'data')
                {
                    this[name] = options[name];
                }
                else
                {
                    data = options[name];
                }
            }
        }
        
        //执行发送前全局start事件
        if (any = flyingon.Ajax.start)
        {
            for (var i = 0, l = any.length; i < l; i++)
            {
                if (any[i].call(this, url) === false)
                {
                    return false;
                }
            }
            
            url =  this.url;
        }
        
        if (!(this.url = url))
        {
            return false;
        }
              
        if ((get = /get|head|options/i.test(this.method)) && data)
        {
            list.push(flyingon.encode(data));
            data = null;
        }
        
        if (this.version)
        {
            list.push('ajax-version=', this.version);
        }
                
        if (any || list.length > 0)
        {
            list.start = url.indexOf('?') >= 0 ? '&' : '?';
        }

        ajax_send(this, url, list, data);

        return this;
    };

    
    
    //发送ajax请求
    function ajax_send(self, url, list, data) {
    
        var xhr = self.xhr = new XMLHttpRequest(),
            any;
        
        if (list.start)
        {
            url = url + list.start + list.join('&');
        }
              
        //CORS
        if (self.CORS)
        {
            //withCredentials是XMLHTTPRequest2中独有的
            if ('withCredentials' in xhr)
            {
                xhr.withCredentials = true;
            }
            else if (any = window.XDomainRequest)
            {
                xhr = new any();
            }
        }
        
        if ((any = self.timeout) > 0)
        {
            self.__timer = setTimeout(function () {

                xhr.abort();
                self.fail('timeout');

            }, any);
        }

        xhr.onreadystatechange = function () {

            ajax_done(self, xhr, url);
        };
        
        xhr.open(self.method, url, self.async);
          
        if (any = self.header)
        {
            for (var name in any)
            {
                xhr.setRequestHeader(name, any[name]);
            }
        }

        xhr.setRequestHeader('Content-Type', self.contentType);

        if (data)
        {
            data = flyingon.encode(data);
            xhr.setRequestHeader('Content-Length', data.length);
        }

        xhr.send(data);
    };
    

    //处理响应结果
    function ajax_done(self, xhr, url) {

        var any = xhr.readyState;

        if (any === 4)
        {
            if (any = self.__timer)
            {
                clearTimeout(any);
                self.__timer = 0;
                any = void 0;
            }

            if (xhr.status < 300)
            {
                switch (self.dataType)
                {
                    case 'json':
                        self.resolve(flyingon.parseJSON(xhr.responseText));
                        break;
                        
                    case 'xml':
                        self.resolve(xhr.responseXML);
                        break;
                        
                    default:
                        self.resolve(xhr.responseText);
                        break;
                }

                if (self.__error)
                {
                    throw self.__error;
                }
            }
            else
            {
                self.reject(any = xhr.statusText);
            }
            
            //结束处理
            ajax_end(self, url, any);
            
            //清除引用
            self.xhr = self.onreadystatechange = null;
        }
        else
        {
            self.notify(any);
        }
    };
    
    
    //ajax执行完毕
    function ajax_end(self, url, error) {
        
        var end = flyingon.Ajax.end;
        
        //执行全局ajax执行结束事件
        if (end)
        {
            for (var i = 0, l = end.length; i < l; i++)
            {
                end[i].call(self, url, error);
            }
        }
    };
    

}).statics(function (Ajax) {


    //自定义ajax开始提交方法
    flyingon.ajaxStart = function (fn) {

        (Ajax.start || (Ajax.start = [])).push(fn);
    };


    //自定义ajax执行结束方法
    flyingon.ajaxEnd = function (fn) {

        (Ajax.end || (Ajax.end = [])).push(fn);
    };


    //ajax提交(默认为GET方式提交)
    flyingon.ajax = function (url, options) {

        return new Ajax().send(url, options);
    };


    //POST提交
    //在IE6时会可能会出错, asp.net服务端可实现IHttpAsyncHandler接口解决些问题 
    flyingon.ajaxPost = function (url, options) {

        options = options || {};
        options.method = 'POST';

        return new Ajax().send(url, options);
    };


});