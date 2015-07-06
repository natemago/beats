(function($){
    $(document).ready(function(){
        r = new libDraw.pkg.runtime.Runtime({
            spec: {
             width: 400,
             height: 400,
             canvas: $('canvas')[0]
            },
            clock:{
             interval: 1000/60,
             mode: 'interval'
            }
        });
        
        var world = {
        		width: 400,
        		height: 400
        };
        
        ball = new beats.objects.Ball({
        	x: world.width/2,
        	y: world.height/2,
        	r: 15,
        	color: '#339'
        });
        
        
        
        htc = {
        		width: 155,
        		height: 262,
        		x: 100,
        		y: 100,
        		ang: Math.PI/4,
        		image: $('img')[0],
        		draw: function(g){
        			
        			g.rotate(this.ang, [this.x + this.width/2, this.y + this.height/2], function(g){
        				g.image(htc.image, htc.x,htc.y);
        			});
        		}
        };
        
        
        r.register(function(g, frame, rt){
            g.clear();
            //ball.draw(g);
            htc.draw(g);
        });
        
        r.clock.start();
   
   
	  chn = new beats.channel.DataChannel({
		  base:'/beats-server',
		  name: 'player-0',
		  dataType: 'text'
	  });  
	  
	  chn.open();
	  chn.read(function(m){
		  var sd = m[0];
		  var ax = sd.values[0];
		  var ay = sd.values[1];
		  var az = sd.values[2];
		  
		  if(ay != 0)
			  htc.ang = Math.atan(-ax/ay);
		  
		  if(ax > ay){
			  if(ax < 0){
				  //console.log('left');
				  ball.move({x:0,y:ball.y},{dx:100,dy:0}, function(){
					  ball.x = world.width/2;
					  ball.y = world.height/2;
				  }); // move left
			  }else{
				  //console.log('right');
				  ball.move({x:world.width,y:ball.y},{dx:100,dy:0}, function(){
					  ball.x = world.width/2;
					  ball.y = world.height/2;
				  }); // move right
			  }
		  }else{
			  if(ay < 0){
				  //console.log('up');
				  ball.move({x:ball.x,y:0},{dx:0,dy:100}, function(){
					  ball.x = world.width/2;
					  ball.y = world.height/2;
				  }); // move up
			  }else{
				  //console.log('down');
				  ball.move({x:ball.x,y:world.height},{dx:0,dy:100}, function(){
					  ball.x = world.width/2;
					  ball.y = world.height/2;
				  }); // move down
			  }
		  }
		  
		  
	  });
    });
})(jQuery);
