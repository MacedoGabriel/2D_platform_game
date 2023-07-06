import Plataforma from "./Plataforma";
import { loadImage } from "./loaderAssets";

export default class Personagem{

    constructor(position = [0,0], size= [0,0], MaxSpeed = [5,5], frames, color = "#00f") {
		this.position = position;
		this.size = size;
		this.MaxSpeed = MaxSpeed;
		this.speed = [0,0];
        this.color = color;
		this.aceleration = [0.8,12];
		this.jumping = false;
		this.decelerate = [2,0.5];
		this.direction = 1;


		this.SpriteWidth = 128;
        this.SpriteHeight = 128;

		this.SpriteAtual = 0;
        this.SpritesTotal = 7;
		this.SpriteSpeed = 0.5;

		this.image = new Image();
		this.loadsprites().then(() => (this.image = this.Sprite["idle"]));
		this.animeSprite(frames);
		
	}

	animeSprite(frames) {
        setInterval(() => {
			this.SpriteAtual = this.SpriteAtual < this.SpritesTotal - 1 ? this.SpriteAtual + 1 : 0;
        }, 1000 / ((frames * this.SpriteSpeed) / 5));
    }

	async loadsprites() {
            
			this.Sprite = {
                idle: await loadImage("/ASSETS/img/sprite/idle.png"),
				run: await loadImage("/ASSETS/img/sprite/run.png"),
				jump: await loadImage("/ASSETS/img/sprite/jump.png"),
				walk: await loadImage("/ASSETS/img/sprite/walk.png"),
            };
	}

    draw(ctx,canvasPosition) {
		//if(this.jumping)
		//	this.color = "#0f0";
		//else
		//	this.color = "#00f";
		ctx.save();
		var xPosition = this.position[0] - canvasPosition[0]
		if(this.direction == -1){
			ctx.scale(-1,1);
			xPosition = -(this.position[0]+this.size[0]- canvasPosition[0] )
		}

		
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#000";
		ctx.strokeRect(xPosition, canvasPosition[1]-this.position[1]-this.size[1], this.size[0], this.size[1]);

		//ctx.fillStyle = this.color;
		//ctx.fillRect(this.position[0], canvasPosition[1]-this.position[1]-this.size[1], this.size[0], this.size[1]);

		
		
		//console.log(xPosition,this.position[0])
		//console.log()

		if(this.image == this.Sprite["idle"])
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 36,                        
				0,							                               
				this.SpriteWidth-2, 
				this.SpriteHeight,
				xPosition,
				canvasPosition[1]-this.position[1]-this.size[1]*2 + 2,
				
				(this.SpriteWidth*this.size[0])/30,
				(this.SpriteHeight*this.size[1])/65
			);
		if(this.image == this.Sprite["walk"])
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 40,                        
				0,							                               
				this.SpriteWidth, 
				this.SpriteHeight,
				xPosition,
				canvasPosition[1]-this.position[1]-this.size[1]*2 + 2,
				(this.SpriteWidth*this.size[0])/30,
				(this.SpriteHeight*this.size[1])/65
			);
		if(this.image == this.Sprite["run"]){
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 44,                        
				0,							                               
				this.SpriteWidth-20, 
				this.SpriteHeight,
				xPosition,
				canvasPosition[1]-this.position[1]-this.size[1]*2 + 2,
				(this.SpriteWidth*this.size[0])/30,
				(this.SpriteHeight*this.size[1])/65
			);
			
		}		
		if(this.image == this.Sprite["jump"]){
			if(this.speed[1] > 8)
				this.SpriteAtual = 2;
			if(this.speed[1] > 2 && this.speed[1] < 8)
				this.SpriteAtual = 3;
			if(this.speed[1] > -2 && this.speed[1] < 2)
				this.SpriteAtual = 4;
			if(this.speed[1] > -8 && this.speed[1] < -2)
				this.SpriteAtual = 5;
			if( this.speed[1] < -8)
				this.SpriteAtual = 6;
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 48,                        
				0,							                               
				this.SpriteWidth, 
				this.SpriteHeight,
				xPosition,
				canvasPosition[1]-this.position[1]-this.size[1]*2 + 5,
				(this.SpriteWidth*this.size[0])/30,
				(this.SpriteHeight*this.size[1])/65
			);
		}
		ctx.restore();
	};  
    
    move(limits, keys, plataformas) {
		var xmov = false; 
		keys.forEach(key => {                   
			//if(!this.jumping){
				if(key=='ArrowLeft'||key=='a'){
					this.speed[0] = this.speed[0] - this.aceleration[0] * (!this.jumping ? 1 : 0.1);
					xmov = true;
				}
				else if(key=='ArrowRight'||key=='d'){
					this.speed[0] = this.speed[0] + this.aceleration[0] * (!this.jumping ? 1 : 0.1);
					xmov = true;
				}
				else{
					xmov = false;
				}
			if(!this.jumping){
				if(key=='ArrowUp'||key=='w'){
					this.speed[1] = this.speed[1] + this.aceleration[1];
					this.jumping=true;
				}
			}
		});
		

		

		if(!xmov && !this.jumping){
			if(this.speed[0] > 0){
				this.speed[0] = this.speed[0] - this.decelerate[0];
				if(this.speed[0] < 0)
					this.speed[0]=0
			}
	
			if(this.speed[0] < 0){
					this.speed[0] = this.speed[0] + this.decelerate[0];
					if(this.speed[0] > 0)
						this.speed[0]=0
			}
		}

		if(this.speed[0] > 0){
			if(this.speed[0] > this.MaxSpeed[0])
				this.speed[0] = this.MaxSpeed[0];
		}

		if(this.speed[0] < 0){
			if(this.speed[0] < (this.MaxSpeed[0]*-1))
				this.speed[0] = this.MaxSpeed[0]*-1;

		}
		if(this.jumping){
			this.speed[1] = this.speed[1] - this.decelerate[1];
		}
		
		if(this.speed[1] < this.MaxSpeed[1]*-1)
			this.speed[1] = this.MaxSpeed[1]*-1;


		

 		var colidio = false;
		
		//console.log(this.position)
		//console.log(this.speed)

		plataformas.forEach(p =>{	
			if(this.colide(p)){
				colidio = true;				
				
				if((this.position[0] + this.size[0] <= p.position[0])){
					if(this.jumping)
						this.speed[0] = this.speed[0]*0;
					else
						this.speed[0] = 0
					this.position[0] = p.position[0] - this.size[0]
					//console.log("direita")
				}
				else if((this.position[0] >= p.position[0] + p.size[0])){
					if(this.jumping)
						this.speed[0] = this.speed[0]*0;
					else
						this.speed[0] = 0
					this.position[0] = p.position[0] + p.size[0]
					//console.log("esquerda")
				}
				else if(this.position[1] + this.size[1] <= p.position[1]){
					this.speed[1] = 0
					this.position[1] = p.position[1] - this.size[1]
					//console.log("cima")
				}
				else if(this.position[1] >= p.position[1] + p.size[1]){
					this.jumping = false;
					this.speed[1] = 0
					this.position[1] = p.position[1] +p.size[1]
					//console.log("baixo")
				}

			}
			
			
		})
		if(!colidio)
			this.jumping = true
		this.position[0] = this.position[0] + this.speed[0];
		this.position[1] = this.position[1] + this.speed[1];
		//if(this.position[1] < 100){
		//	this.jumping = false;
		//	this.speed[1] = 0;
		//	this.position[1] = 100; 
		//}
		
		
		//this.limits(limits);
		

		if(!this.jumping){
			if(this.speed[0] == 0 && this.image != this.Sprite["idle"]){
				this.image = this.Sprite["idle"];
				this.SpriteAtual = 0;
				this.SpritesTotal = 7;
			}
			if(this.speed[0] != 0 && Math.abs(this.speed[0]) != this.MaxSpeed[0] && this.image != this.Sprite["walk"] ){
				this.image = this.Sprite["walk"];
				this.SpriteAtual = 0;
				this.SpritesTotal = 7;
			}
			if(Math.abs(this.speed[0]) == this.MaxSpeed[0] && this.image != this.Sprite["run"]){
				this.image = this.Sprite["run"];
				this.SpriteAtual = 0;
				this.SpritesTotal = 8;
			}}
		if(this.speed[1] != 0 && this.image != this.Sprite["jump"]){
			this.image = this.Sprite["jump"];
			this.SpriteAtual = 2;
			this.SpritesTotal = 8;
		}

		if(this.speed[0] > 0)
			this.direction = 1;
		if(this.speed[0] < 0)
			this.direction = -1;
		
	};

	limits(limits) {
		if(this.position[0] >= 0){
			if(this.position[0] + this.size[0] > limits.width){
				this.position[0] = limits.width - this.size[0]
				this.speed[0] = 0
			}
		}
		else{
			this.position[0] = 0
			this.speed[0] = 0
		}
	}

	colide(p){
		var colidio = 0;
		if(this.position[0] + this.speed[0] + this.size[0] > p.position[0] && this.position[0] + this.speed[0] < p.position[0] + p.size[0]){
			colidio ++;
		}
		if(this.position[1] + this.speed[1] < p.position[1] + p.size[1] && this.position[1] + this.size[1]+this.speed[1] > p.position[1]){
			colidio ++;
		}
		//p.color = "#f00"
		if(colidio == 2){
			//p.color = "#ff0"
			//console.log(p.position)
			//console.log(this.position)
			return true;
		}


	}
}