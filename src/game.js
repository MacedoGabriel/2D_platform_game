
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

const loop = () => {
	setTimeout(() => {
		CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)

		plataformas.forEach(plataforma =>{
			plataforma.draw(CTX,ctxPosition)
		})

		teste.move(boundaries, keys,plataformas);

		//plataformas.forEach(plataforma =>{
		//	plataforma.colide(teste)
		//})
		
		teste.draw(CTX,ctxPosition);
		//console.log(keys);

		ctxPosition[0] = - 350;
		ctxPosition[0] = +teste.position[0]-350
		if(ctxPosition[0] < 0)
			ctxPosition[0] = 0
		console.log(ctxPosition,teste.position)
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
		width: CANVAS.width,
		height: CANVAS.height
	}

	teste = new Personagem([100,100],[30,65],[8,15],FRAMES)

	plataformas.push(new Plataforma([0,0],[10000,100]))
	plataformas.push(new Plataforma([200,100],[100,100]))
	plataformas.push(new Plataforma([400,200],[100,100]))
	plataformas.push(new Plataforma([550,300],[150,50]))
	plataformas.push(new Plataforma([200,350],[150,50]))
	//plataformas.push(new Plataforma([0,0],[10,CANVAS.height]))

	keyPress(window)
	loop()
}


export { init, loop }