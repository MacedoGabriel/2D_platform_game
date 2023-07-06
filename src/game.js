
import Personagem from "./Personagem";
import Plataforma from "./Plataforma";
//import Personagem from "../src/Personagem"
import { keyPress, keys } from "./keyboard"

let CTX
let CANVAS
const FRAMES = 60
let gameover = false;
let animeReqReference;
let teste;
const gravidadede = 4;
let boundaries;
let ctxPosition = [0,0];
let plataformas = [];

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const loop = () => {
	setTimeout(() => {
		CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
		teste.move(boundaries, keys,plataformas);	
		teste.draw(CTX,ctxPosition);
		ctxPosition[0] = +teste.position[0]-350
		ctxPosition[1] = CANVAS.height + teste.position[1]-200
		if(ctxPosition[0] < 0)
			ctxPosition[0] = 0
		if(ctxPosition[0] > 48*30-CANVAS.width)
			ctxPosition[0] = 48*30-CANVAS.width
		if(ctxPosition[1] < 600)
			ctxPosition[1] = 600

		plataformas.forEach(plataforma =>{
			if(plataforma.colide(CANVAS,ctxPosition))
				plataforma.draw(CTX,ctxPosition)
		})

		if (gameover) {
			console.error('DEAD!!!')
			cancelAnimationFrame(animeReqReference)
		} else	animeReqReference = requestAnimationFrame(loop)

	}, 1000 / FRAMES)
}

const  init = async ()=>{
	console.log("Initialize Canvas")
	CANVAS = document.querySelector('canvas')
	CTX = CANVAS.getContext('2d')
	ctxPosition = [0,CANVAS.height]
	
	boundaries = {
		width: 48*30,
		height: 1000
	}

	teste = new Personagem([100,100],[30,65],[8,15],FRAMES);

	plataformas.push(new Plataforma([0,0],[48*30,48],"#f00","floor"))
	//plataformas.push(new Plataforma([200,48],[100,100]))
	plataformas.push(new Plataforma([400,150],[48*3,16],"#f00","plataform"))
	plataformas.push(new Plataforma([650,250],[48*5,16],"#f00","plataform"))
	plataformas.push(new Plataforma([170,320],[48*5,16],"#f00","plataform"))
	plataformas.push(new Plataforma([250,450],[48*2,16],"#f00","plataform"))
	//plataformas.push(new Plataforma([0,0],[10,CANVAS.height]))

	keyPress(window)

	await sleep(1000)
	loop()
}


export { init, loop }