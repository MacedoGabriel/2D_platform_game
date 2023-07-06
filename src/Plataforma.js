export default class Plataforma{

    constructor(position = [0,0], size= [0,0], color = "#f00") {
		this.position = position;
		this.size = size;
        this.color = color;
	}

    draw(ctx,canvasPosition) {
	
		ctx.lineWidth = 5;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position[0] - canvasPosition[0], canvasPosition[1]-this.position[1]-this.size[1], this.size[0], this.size[1]);
	};  


    
}