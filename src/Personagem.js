import Plataforma from "./Plataforma";
import { loadImage } from "./loaderAssets";

export default class Personagem{

    constructor(position = {x:0,y:0}, size=  {x:0,y:0}, MaxSpeed =  {x:5,y:5}, frames, color = "#00f") {
		this.position = position;
		this.size = size;
		this.MaxSpeed = MaxSpeed;
		this.speed = {x:0,y:0};
        this.color = color;
		this.aceleration =  {x:0.8,y:12};
		this.jumping = false;
		this.decelerate = {x:2,y:0.5};
		this.direction = 1;
		this.IS_LOADING = true;

		this.SpriteWidth = 128;
        this.SpriteHeight = 128;

		this.SpriteAtual = 0;
        this.SpritesTotal = 7;
		this.SpriteSpeed = 0.5;

		this.image = new Image();
		this.loadsprites().then(() => {this.image = this.Sprite["idle"]
									   this.IS_LOADING=false});
		this.animeSprite(frames);
		
	}

	isLoaded(){
		return new Promise((resolve,reject)=>{
			const interval = setInterval(()=>{
				console.log('Interval: ',this.IS_LOADING)
				if(!this.IS_LOADING){
					clearInterval(interval)
					console.log('Interval OFF: ',this.IS_LOADING)
					resolve(true)
				}
			},1000)
			setTimeout(()=>{reject(false)},60000)
		})
	}

	animeSprite(frames) {
        setInterval(() => {
			this.SpriteAtual = this.SpriteAtual < this.SpritesTotal - 1 ? this.SpriteAtual + 1 : 0;
        }, 1000 / ((frames * this.SpriteSpeed) / 5));
    }

	async loadsprites() {
			this.Sprite = {
                idle: await loadImage("/ASSETS/img/sprite/Idle.png"),
				run: await loadImage("/ASSETS/img/sprite/Run.png"),
				jump: await loadImage("/ASSETS/img/sprite/Jump.png"),
				walk: await loadImage("/ASSETS/img/sprite/Walk.png"),
            };
	}

    draw(ctx,canvasPosition) {

		ctx.save();
		var xPosition = this.position.x - canvasPosition.x
		if(this.direction == -1){
			ctx.scale(-1,1);
			xPosition = -(this.position.x+this.size.x - canvasPosition.x )
		}
		
		//ctx.lineWidth = 2;
		//ctx.strokeStyle = "#000";
		//ctx.strokeRect(xPosition, canvasPosition.y-this.position.y-this.size.y, this.size.x, this.size.y);

		if(this.image == this.Sprite["idle"])
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 36,                        
				0,							                               
				this.SpriteWidth-2, 
				this.SpriteHeight,
				xPosition,
				canvasPosition.y-this.position.y-this.size.y*2 + 2,
				
				(this.SpriteWidth*this.size.x)/30,
				(this.SpriteHeight*this.size.y)/65
			);
		if(this.image == this.Sprite["walk"])
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 40,                        
				0,							                               
				this.SpriteWidth, 
				this.SpriteHeight,
				xPosition,
				canvasPosition.y-this.position.y-this.size.y*2 + 2,
				(this.SpriteWidth*this.size.x)/30,
				(this.SpriteHeight*this.size.y)/65
			);
		if(this.image == this.Sprite["run"]){
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 30,                        
				0,							                               
				this.SpriteWidth-10, 
				this.SpriteHeight,
				xPosition,
				canvasPosition.y-this.position.y-this.size.y*2 + 2,
				(this.SpriteWidth*this.size.x)/30,
				(this.SpriteHeight*this.size.y)/65
			);
		}		
		if(this.image == this.Sprite["jump"]){
			if(this.speed.y > 8)
				this.SpriteAtual = 2;
			if(this.speed.y > 2 && this.speed.y < 8)
				this.SpriteAtual = 3;
			if(this.speed.y > -2 && this.speed.y < 2)
				this.SpriteAtual = 4;
			if(this.speed.y > -8 && this.speed.y < -2)
				this.SpriteAtual = 5;
			if( this.speed.y < -8)
				this.SpriteAtual = 6;
			ctx.drawImage(
				this.image,                                                   
				(this.SpriteAtual * this.SpriteWidth) + 48,                        
				0,							                               
				this.SpriteWidth, 
				this.SpriteHeight,
				xPosition,
				canvasPosition.y-this.position.y-this.size.y*2 + 5,
				(this.SpriteWidth*this.size.x)/30,
				(this.SpriteHeight*this.size.y)/65
			);
		}
		ctx.restore();
	};  
    
    move(limits, keys, plataformas) {
		var xmov = false; 
		keys.forEach(key => {                   
			//if(!this.jumping){
				if(key=='ArrowLeft' || key=='a'){
					this.speed.x = this.speed.x - this.aceleration.x * (!this.jumping ? 1 : 0.1);
					xmov = true;
				}
				else if(key=='ArrowRight'|| key=='d'){
					this.speed.x = this.speed.x + this.aceleration.x * (!this.jumping ? 1 : 0.1);
					xmov = true;
				}
				else{
					xmov = false;
				}
			if(!this.jumping){
				if(key=='ArrowUp' || key=='w'){
					this.speed.y = this.speed.y + this.aceleration.y;
					this.jumping=true;
				}
			}
		});
		
		if(!xmov && !this.jumping){
			if(this.speed.x > 0){
				this.speed.x = this.speed.x - this.decelerate.x;
				if(this.speed.x < 0)
					this.speed.x=0
			}
	
			if(this.speed.x < 0){
					this.speed.x = this.speed.x + this.decelerate.x;
					if(this.speed.x > 0)
						this.speed.x=0
			}
		}

		if(this.speed.x > 0){
			if(this.speed.x > this.MaxSpeed.x)
				this.speed.x = this.MaxSpeed.x;
		}
		if(this.speed.x < 0){
			if(this.speed.x < (this.MaxSpeed.x*-1))
				this.speed.x = this.MaxSpeed.x*-1;
		}

		if(this.jumping){
			this.speed.y = this.speed.y - this.decelerate.y;
		}
		
		if(this.speed.y < this.MaxSpeed.y*-1)
			this.speed.y = this.MaxSpeed.y*-1;

 		var colidio = false;
	
		plataformas.forEach(p =>{	
			if(this.colide(p)){
				colidio = true;				
				
				if((this.position.x + this.size.x <= p.position.x)){
					if(this.jumping)
						this.speed.x = this.speed.x*0;
					else
						this.speed.x = 0
					this.position.x = p.position.x - this.size.x
					//console.log("direita")
				}
				else if((this.position.x >= p.position.x + p.size.x)){
					if(this.jumping)
						this.speed.x = this.speed.x*0;
					else
						this.speed.x = 0
					this.position.x = p.position.x + p.size.x
					//console.log("esquerda")
				}
				else if(this.position.y + this.size.y <= p.position.y){
					this.speed.y = 0
					this.position.y = p.position.y - this.size.y
					//console.log("cima")
				}
				else if(this.position.y >= p.position.y + p.size.y){
					this.jumping = false;
					this.speed.y = 0
					this.position.y = p.position.y +p.size.y
					//console.log("baixo")
				}

			}				
		})
		if(!colidio)
			this.jumping = true
		this.position.x = this.position.x + this.speed.x;
		this.position.y = this.position.y + this.speed.y;
		//if(this.position.y < 100){
		//	this.jumping = false;
		//	this.speed.y = 0;
		//	this.position.y = 100; 
		//}
		
		//this.limits(limits);
		
		if(!this.jumping){
			if(this.speed.x == 0 && this.image != this.Sprite["idle"]){
				this.image = this.Sprite["idle"];
				this.SpriteAtual = 0;
				this.SpritesTotal = 7;
			}
			if(this.speed.x != 0 && Math.abs(this.speed.x) != this.MaxSpeed.x && this.image != this.Sprite["walk"] ){
				this.image = this.Sprite["walk"];
				this.SpriteAtual = 0;
				this.SpritesTotal = 7;
			}
			if(Math.abs(this.speed.x) == this.MaxSpeed.x && this.image != this.Sprite["run"]){
				this.image = this.Sprite["run"];
				this.SpriteAtual = 0;
				this.SpritesTotal = 8;
			}}
		if(this.speed.y != 0 && this.image != this.Sprite["jump"]){
			this.image = this.Sprite["jump"];
			this.SpriteAtual = 2;
			this.SpritesTotal = 8;
		}

		if(this.speed.x > 0)
			this.direction = 1;
		if(this.speed.x < 0)
			this.direction = -1;
		
	};

	limits(limits) {
		if(this.position.x >= 0){
			if(this.position.x + this.size.x > limits.width){
				this.position.x = limits.width - this.size.x
				this.speed.x = 0
			}
		}
		else{
			this.position.x = 0
			this.speed.x = 0
		}
	}

	colide(p){
		var colidio = 0;
		if(this.position.x + this.speed.x + this.size.x > p.position.x && this.position.x + this.speed.x < p.position.x + p.size.x){
			colidio ++;
		}
		if(this.position.y + this.speed.y < p.position.y + p.size.y && this.position.y + this.size.y+this.speed.y > p.position.y){
			colidio ++;
		}
		if(colidio == 2){
			return true;
		}
	}
}