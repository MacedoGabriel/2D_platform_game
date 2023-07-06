import { loadImage } from "./loaderAssets";

export default class Plataforma{

    constructor(position = [0,0], size= [0,0], color = "#f00", plataformType=null) {
		this.position = position;
		this.size = size;
        this.color = color;
		this.plataformType = plataformType;
		this.image = new Image();
		this.imgs = []
		if(this.plataformType){
			this.loadsImgs().then(()=>(this.image = this.imgs[1]))
		}
	}

	async loadsImgs() {
            
		if(this.plataformType = "floor"){		
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile77.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile78.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile89.png"));
			this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile100.png"));
		this.imgsTotal = 4;
	}
	if(this.plataformType = "floor"){		
		this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile77.png"));
		this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile78.png"));
		this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile89.png"));
		this.imgs.push(await loadImage("/ASSETS/img/Tiles/tile100.png"));
	this.imgsTotal = 4;
}



}

    draw(ctx,canvasPosition) {
	
		//ctx.lineWidth = 5;
		//ctx.fillStyle = this.color;
		//ctx.fillRect(this.position[0] - canvasPosition[0], canvasPosition[1]-this.position[1]-this.size[1], this.size[0], this.size[1]);

		ctx.lineWidth = 2;
		ctx.strokeStyle = this.color;;
		ctx.strokeRect(this.position[0] - canvasPosition[0], canvasPosition[1]-this.position[1]-this.size[1], this.size[0], this.size[1]);
		if(this.plataformType){
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
	};  

	colide(CTX,ctxPosition){
		
		var colidio = 0;
		if(this.position[0] + this.size[0] > ctxPosition[0] && this.position[0] < ctxPosition[0] + CTX.width){
			colidio ++;
		}
		if(this.position[1] < ctxPosition[1] && this.position[1] + this.size[1] > ctxPosition[1]-CTX.height){
			colidio ++;
		}
		//p.color = "#f00"
		if(colidio == 2){
			//p.color = "#ff0"
			//console.log(p.position)
			
			return true;
		}
		console.log("fora da tela")
		return false;

	}
}