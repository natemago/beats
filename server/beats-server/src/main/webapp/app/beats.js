(function($){
    
    var Base = function(config){
        libDraw.ext(this, config);
        this.init();
    };
    
    libDraw.ext(Base, {
        init: function(){
            // do you initialization...
        }
    });
    
    var Client = function(config){
        Client.superclass.constructor.call(this, config);
    };
    
    libDraw.ext(Client, Base);
    libDraw.ext(Client, {
        init: function(){
            
        },
        __call: function(url, method, data, success, error){
        	var self = this;
            $.ajax({
                url: this.base + '/' + (url || ''),
                type: method, // FIXME
                data: data,
                dataType: this.dataType || 'json',
                success: function(resp){
                    if(success){
                        success.call(self, resp);
                    }
                },
                error: function(errorText, err, jqxr){
                    if(error){
                        error.call(self, errorText, err, jqxr);
                    }
                }
            });
        },
        get: function(url, data, success, error){
            this.__call(url, 'GET', data, success, error);
        },
        post: function(url, data, success, error){
            this.__call(url, 'POST', data, success, error);
        }
    });
    
    
    var PollingChannel = function(config){
        PollingChannel.superclass.constructor.call(this, config);
    };
    
    libDraw.ext(PollingChannel, Client);
    libDraw.ext(PollingChannel, {
        init: function(){
            this.buffer = [];
            this.handlers = [];
        },
        write: function(message){},
        read: function(callback){
            this.handlers.push(callback);
        },
        open: function(callback){
            var self = this;
            this.get('sub/' + this.name, {}, function(confirm){
                this.channelId = confirm.channelId;
                self.ableToRead = true;
                if(callback){
                    callback.call(self, confirm.info);
                }
                this.__loop(callback);
            }, function(){});
        },
        close: function(){
            this.ableToRead = false;
        },
        __loop: function(callback){
            var self = this;
            if(this.ableToRead){
                this.get('poll/' + this.id, {}, function(resp){
                    self.__loop(callback);
                    if(resp.messages){
                        libDraw.each(self.handlers, function(hnd){
                            hnd.call(this, resp.messages);
                        }, self);
                    }
                }, function(){});
            }
        }
    });
    
    
    window.beats = {
        core: {
            Base: Base,
            Client: Client
        },
        channel: {
            DataChannel: PollingChannel
        }
    };
    
})(jQuery);
