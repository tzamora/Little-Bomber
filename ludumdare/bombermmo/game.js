window.onload = function () {
    
    /*var socket = io.connect('http://localhost:5454');
    
    // {'port':5454}
 
    // socket.connect();
 
    console.log(socket);
 
    socket.on('connect', 
        function(evt)
        { 
            console.log('connected',evt) 
        });
 
    socket.on('message', 
        function(evt)
        { 
            alert('te moriste playo');
        });
    
 
    socket.on('disconnect', 
        function(evt)
        {
            console.log('disconnected',evt) 
        });*/
    
    var player;
    
    TILE_SPACE = 18;
    
    //
    //start crafty
    //
    
    Crafty.init(500, 500);
    
    //
    // load sprites
    //
    
    Crafty.sprite(16, "assets/sprites.png",{
        player:     [0,3],
        bomb:       [0,2],
        wall:       [0,0],
        explosion:  [0,1]
    });
    
    //
    // generate tiles in map
    //
    
    function generateMap()
    {
        for(var i = 0; i < 25; i++)
        {
            for(var j = 0; j < 25; j++)
            {
                //
                // put wallscx
                //
                
                if( (i % 2) === 0 && (j % 2) === 0)
                {
                    var w = Crafty.e("2D, DOM, wall, Collision, solid, SpriteAnimation")
                    .attr({
                        x:i*TILE_SPACE, 
                        y:j*TILE_SPACE,
                        z:1
                    })
                    .collision();
                    
                    if(w.hit('solid')) {
                        w.destroy();
                    }
                }
            }     
        }
    }
    
    //
    // create the player 1
    //
    
    function createPlayer1()
    {
        player = 
        Crafty.e("2D, DOM, player, controls, bomber")
        .attr({
            x:TILE_SPACE, 
            y:TILE_SPACE, 
            z:1
        })
        .controls(5)
        .bomber();
    }
    
    //
    // create the player 2
    //
    
    function createPlayer2()
    {
        var player2 = 
        Crafty.e("2D, DOM, player, controls, bomber")
        .attr({
            x:TILE_SPACE*3, 
            y:TILE_SPACE*3, 
            z:1
        })
        .bomber();
    }
    
    //
    // sets a bomb
    //
    
    function putBomb()
    {   
        Crafty.e("bombComponent")
        .attr({
            x:player.x, 
            y:player.y, 
            z:1
        });
    }
    
    //
    // bomb component
    // 
    
    Crafty.c('bombComponent', {
        
        init:function()
        {
            this.requires("2D, DOM, bomb, SpriteAnimation, Delay")
            .animate('explode', 0, 2, 3)
            .animate('explode', 50, -1)
            .bind('explode', function()
            {
                this.destroy();
              
                Crafty.e('2D, DOM, explosion, explodable, Delay')
                .attr({
                    x:this.x, 
                    y:this.y, 
                    z:1
                })
                .delay(function() 
                {
                    this.destroy();
                }, 300);
            })
            .delay(function() 
            {
                this.trigger("explode");
            }, 1000);
        }
    });
    
    /*Crafty.c('Grid', {
     
        _cellSize:16,
        Grid: function(cellSize)
        {
            if(cellSize)
            {
                this._cellSize = cellSize;
             
                return this;
            }
        },
        col: function(col)
        {
            if(arguments.length === 1)
            {
                this.x = this.cellSize * col;
                
                return this;
            }
            else
            {
                return Math.round(this.x / this._cellSize);
            }
        },
        row: function(row)
        {
            if(arguments.length === 1)
            {
                this.y = this.cellSize * row;
                
                return this;
            }
            else
            {
                return Math.round(this.y / this._cellSize);
            }
        }
    });*/
    
    //
    // bomber character
    //
    
    Crafty.c('bomber', {
        
        bomber: function(){
    
            this.requires("SpriteAnimation, Collision")
            .animate('walk_left',   0, 3, 1)
            .animate('walk_right',  0, 3, 1)
            .animate('walk_up',     0, 3, 1)
            .animate('walk_down',   0, 3, 1)

            .bind('NewDirection',
        
                function(direction)
                {
                    if(direction.x < 0)
                    {
                        if(!this.isPlaying('walk_left'))
                        {
                            this.stop().animate('walk_left', 10, -1);
                        }
                    }
                    
                    if(direction.x > 0)
                    {
                        if(!this.isPlaying("walk_right"))
                        {
                            this.stop().animate('walk_right', 10, -1);
                        }
                    }
                    
                    if(direction.y < 0)
                    {
                        if(!this.isPlaying("walk_up"))
                        {
                            this.stop().animate('walk_up', 10, -1);
                        }
                    }
                    
                    if(direction.y > 0)
                    {
                        if(!this.isPlaying("walk_down"))
                        {
                            this.stop().animate('walk_down', 10, -1);
                        }
                    }
                })
                
            .bind('Moved', function(from)
            {
                if(this.hit('solid'))
                {
                    this.attr({
                        x:from.x, 
                        y:from.y
                    })
                }
            })
            .onHit('explodable', function()
            {
                this.destroy();
                
                //socket.emit('message');
                
                createPlayer1();
            });
            
            return this;
        }
        
    });
    
    //
    // controls component
    //
    
    Crafty.c("controls",{
     
        init: function()
        { 
            this.requires('Multiway');
            
        },
        
        controls: function(speed)
        {
            this.multiway(speed, {
                W:-90, 
                S:90, 
                D:0, 
                A:180
            })
            
            .bind('KeyDown', function(e)
            {
                if(e.key == Crafty.keys['SPACE']) 
                { 
                    putBomb();
                }
            });
            
            return this;
        }
     
    });
    
    //
    // loading scene
    //
    
    Crafty.scene("loading", function(){
        
        Crafty.load(["assets/sprites.png"], 
            function () {
                
                //
                //when everything is loaded, run the main scene
                //
                
                Crafty.scene("main");
            
            });
        
        Crafty.background("#FFF");
        
        Crafty.e("2D, DOM, Text").attr({
            w:100, 
            h:20, 
            x:150, 
            y:120
        })
        .text("LOADING");
    });
    
    //
    // main function
    //
    
    Crafty.scene("main", function(){
        
        generateMap();
        
        //
        // build player
        //
    
        createPlayer1();
        
        createPlayer2();
    
    });
    
    //
    // begin with the loading scene
    //
    Crafty.scene("loading");
    
};