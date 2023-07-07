
import Personagem from "./Personagem";
import Plataforma from "./Plataforma";
import { keyPress, keys } from "./keyboard"

let CTX
let CANVAS
const FRAMES = 60
let gameover = false;
let animeReqReference;
let personagem;
const gravidadede = 4;
let boundaries;
let ctxPosition = [0,0];
let plataformas = [];

const loop = () => {
	setTimeout(() => {
		CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
		
		personagem.move(boundaries, keys, plataformas);	
		
		ctxPosition[0] = personagem.position[0] + personagem.size[0]/2 - CANVAS.width/2
		ctxPosition[1] = CANVAS.height + personagem.position[1]-200
		if(ctxPosition[0] < 0)
			ctxPosition[0] = 0
		if(ctxPosition[0] > 48*30-CANVAS.width)
			ctxPosition[0] = 48*30-CANVAS.width
		if(ctxPosition[1] < 600)
			ctxPosition[1] = 600

		personagem.draw(CTX,ctxPosition);

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
	await loadLevel();
	keyPress(window)
	loop()
}

const  loadLevel = async ()=>{
	
	personagem = new Personagem([100,50],[30,65],[8,15],FRAMES);

	plataformas.push(new Plataforma([0,0],[48,48*30],"leftWall"))
	plataformas.push(new Plataforma([48*29,0],[48,48*30],"rigthWall"))
	plataformas.push(new Plataforma([0,0],[48*30,48],"floor"))
	
	plataformas.push(new Plataforma([400,150],[48*3,16],"plataform"))
	plataformas.push(new Plataforma([650,250],[48*5,16],"plataform"))
	plataformas.push(new Plataforma([170,320],[48*5,16],"plataform"))
	plataformas.push(new Plataforma([250,450],[48*2,16],"plataform"))
	plataformas.push(new Plataforma([690,470],[48*2,16],"plataform"))
	plataformas.push(new Plataforma([1100,470],[48*2,16],"plataform"))
	plataformas.push(new Plataforma([48*28,500],[48,48*2],"leftBlock"))
	plataformas.push(new Plataforma([1100,48],[48*4,48*2],"bottonBlock"))
	plataformas.push(new Plataforma([930,710],[48*4,16],"plataform"))
	plataformas.push(new Plataforma([600,830],[48*2,16],"plataform"))
	plataformas.push(new Plataforma([200,850],[48*2,16],"plataform"))
	plataformas.push(new Plataforma([48,900],[48,48*2],"rigthBlock"))
}

export { init, loop }