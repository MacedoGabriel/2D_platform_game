import { loadImage } from "./loaderAssets";

export default class Plataforma{

    constructor(position = [0,0], size= [0,0], plataformType=null, color = "#f00") {
		this.position = position;
		this.size = size;
        this.color = color;
		this.plataformType = plataformType;
		this.IS_LOADING = true;
		this.image = new Image();
		this.imgs = []
		if(this.plataformType){
			this.loadsImgs().then(()=>{this.IS_LOADING=false});
		}
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


	async loadsImgs() {        
		if(this.plataformType == "floor"){		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile77.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile78.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile89.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile100.png"));
		this.imgsTotal = 4;
		}
		else if(this.plataformType == "plataform"){		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile18.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile19.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile20.png"));
		this.imgsTotal = 3;
		}
		else if(this.plataformType == "leftWall"){		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile124.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile122.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile112.png"));
		this.imgsTotal = 3;
		}
		else if(this.plataformType == "rigthWall"){		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile116.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile120.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile84.png"));
		this.imgsTotal = 3;
		}
		else if(this.plataformType == "leftBlock"){
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile121.png"));		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile83.png"));
		this.imgsTotal = 2;
		}
		else if(this.plataformType == "rigthBlock"){
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile118.png"));		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile82.png"));
		this.imgsTotal = 2;
		}
		else if(this.plataformType == "bottonBlock"){
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile49.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile59.png"));		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile61.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile34.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile58.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile56.png"));

		this.imgsTotal = 6;
		}
		else if(this.plataformType == "block"){
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile121.png"));		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile83.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile118.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile82.png"));
		this.imgsTotal = 4;
		}
	}

    draw(ctx,canvasPosition) {
	
		//ctx.lineWidth = 2;
		//ctx.strokeStyle = this.color;;
		//ctx.strokeRect(this.position[0] - canvasPosition[0], canvasPosition[1]-this.position[1]-this.size[1], this.size[0], this.size[1]);
		
		if(this.plataformType == "floor"){
			var i = 0; 
			var img = 0
			while(i<this.size[0]){
				this.image = this.imgs[img]
				ctx.drawImage(
				this.image,                                                   
				0,                        
				0,							                               
				48, 
				48,
				i+this.position[0] - canvasPosition[0],
				canvasPosition[1]-this.position[1]-this.size[1],
				48,
				48
			);
			//console.log(i,this.position[0], canvasPosition[0])
			i +=48;
			img++
			if(img>=this.imgsTotal)
				img = 0;
			}	
		}
		if(this.plataformType == "plataform"){
			var i = 0; 
			var img = 0;
			var nImgs = this.size[0]/48-1;
			while(i<this.size[0]){
				if(img==0)
					this.image = this.imgs[2]
				if(img>0)
					this.image = this.imgs[1]
				if(img==nImgs)
					this.image = this.imgs[0]
				ctx.drawImage(
				this.image,                                                   
				0,                        
				0,							                               
				48, 
				48,
				i+this.position[0] - canvasPosition[0],
				canvasPosition[1]-this.position[1]-this.size[1]-32,
				48,
				48
			);
			//console.log(i,this.position[0], canvasPosition[0])
			i +=48;
			img++
			}	
		}
		if(this.plataformType == "leftWall" || this.plataformType == "rigthWall" || this.plataformType == "leftBlock" || this.plataformType == "rigthBlock"){
			var i = 0; 
			var img = 0
			while(i<this.size[1]){
				this.image = this.imgs[img]
				ctx.drawImage(
				this.image,                                                   
				0,                        
				0,							                               
				48, 
				48,
				this.position[0] - canvasPosition[0],
				i+canvasPosition[1]-this.position[1]-this.size[1],
				48,
				48
			);
			//console.log(i,this.position[0], canvasPosition[0])
			i +=48;
			img++
			if(img>=this.imgsTotal)
				img = 0;
			}	
		}
		if(this.plataformType == "block"){
			var i = 0;
			var c = 0; 
			var img = 0;
			while(c<this.size[0]){
				i=0;
				while(i<this.size[1]){
					this.image = this.imgs[img]
					ctx.drawImage(
					this.image,                                                   
					0,                        
					0,							                               
					48, 
					48,
					c+this.position[0] - canvasPosition[0],
					i+canvasPosition[1]-this.position[1]-this.size[1],
					48,
					48
					);
					i +=48;
					
					img++
				}
				c +=48;	
			}
		};
		if(this.plataformType == "bottonBlock"){
			var i = 0;
			var c = 0; 
			var nImgX = this.size[0]/48-1;
			var nImgY = this.size[1]/48-1;
		
			while(c<this.size[0]/48){
				i=0;
				while(i<this.size[1]/48){
					if(c==0 && i != 0)
						this.image = this.imgs[4];
					else if(c==0 && i == 0)
						this.image = this.imgs[2];
					else if(c!=0 && c!=nImgX && i == 0)
						this.image = this.imgs[1];
					else if(c == nImgX && i	 != 0)
						this.image = this.imgs[5];					
					else if(c == nImgX && i == 0)
						this.image = this.imgs[0];
					else
						this.image = this.imgs[3];

					ctx.drawImage(
					this.image,                                                   
					0,                        
					0,							                               
					48, 
					48,
					(c*48)+this.position[0] - canvasPosition[0],
					(i*48)+canvasPosition[1]-this.position[1]-this.size[1],
					48,
					48
					);
					i ++;
				}
				c ++;	
			}
		};
	}  

	colide(CTX,ctxPosition){
		
		var colidio = 0;
		if(this.position[0] + this.size[0] > ctxPosition[0] && this.position[0] < ctxPosition[0] + CTX.width){
			colidio ++;
		}
		if(this.position[1] < ctxPosition[1] && this.position[1] + this.size[1] > ctxPosition[1]-CTX.height){
			colidio ++;
		}
		if(colidio == 2){	
			return true;
		}
		return false;
	}
}