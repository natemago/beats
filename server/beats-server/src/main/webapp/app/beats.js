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
                	var res = undefined;
                	try{
                		res = JSON.parse(resp);
                	}catch(e){
                		if(error){
                			error.call(self, 'Parser Error', e.message, e);
                		}
                	}
                    if(success && res){
                        success.call(self, res);
                    }
                },
                error: function(errorText, err, jqxr){
                    if(error){
                        error.call(self, errorText, err, jqxr);
                    }
                },
                cache: false
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
                this.get('poll/' + this.name, {}, function(resp){ // no chanel id
                	
                    self.__loop(callback);
                    if(resp.data){
                        libDraw.each(self.handlers, function(hnd){
                            hnd.call(this, resp.data);
                        }, self);
                    }
                }, function(a,b,c){
                	console.log('error',a,b,c);
                });
            }
        }
    });
    
    
    var Ball = function(config){
    	Ball.superclass.constructor.call(this, config);
    };
    
    libDraw.ext(Ball, Base);
    libDraw.ext(Ball, {
    	move: function(toPoint, m, onDone){
    		if(!this.moving){
    			console.log('move', toPoint, m);
    			this.target = {
    					point: toPoint,
    					m: m,
    					callback: onDone
    			};
    			this.moving = true;
    		}
    	},
    	draw: function(g){
    		if(this.moving){
	    		var xd=false,yd=false;
	    		if(this.x >= this.target.point.x){
	    			this.x = this.target.point.x;
	    			xd=true;
	    		}
	    		if(this.y >= this.target.point.y){
	    			this.y = this.target.point.y;
	    			yd=true;
	    		}
	    		if(xd && yd){
	    			this.moving = false;
	    			this.target.callback.call(this);
	    		}else{
	    			this.x += this.target.m.dx;
	        		this.y += this.target.m.dy;
	    		}
	    		this.target.m.dx /= 2;
	    		this.target.m.dy /= 2;
    		}
    		g.fill(this.color);
    		g.circle(this.x, this.y, this.r);
    	}
    });
    
    window.beats = {
        core: {
            Base: Base,
            Client: Client
        },
        channel: {
            DataChannel: PollingChannel
        },
        objects: {
        	Ball: Ball
        }
    };
    
})(jQuery);
