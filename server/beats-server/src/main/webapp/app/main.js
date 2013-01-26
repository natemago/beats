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
        
        
        ball = {x:100,y:100,r:10};
        
        
        r.register(function(g, frame, rt){
            g.clear();
            g.fill('red');
            g.circle(ball.x, ball.y, ball.r);
            
        });
        
        r.clock.start();
   });
   
  chn = new beats.channel.DataChannel({
	  base:'/beats-server',
	  name: 'player-0'
  });  
  
  chn.open();
  chn.read(function(m){
	  console.log('read');
  });
})(jQuery);
