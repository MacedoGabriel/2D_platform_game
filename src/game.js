
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
let score = 0
let maxScore = 0
let vidas = -1 // numeros de vida (-1 = infinitas)
let safeZone = 200
let vulneravel = false


const  init = async ()=>{
	console.log("Initialize Canvas")
	CANVAS = document.querySelector('canvas')
	CTX = CANVAS.getContext('2d')
	ctxPosition = [0,CANVAS.height]
	boundaries = {
		width: 48*30,
		height: 1000
	}

	loadLevel().then(()=>{loop()})
	keyPress(window)
}


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



		if(!personagem.jumping)
			score = personagem.position[1]-48
		if(score > 900)
			score = 900
		if(score>maxScore)
			maxScore = score
		if(vidas>=0){
			if(personagem.position[1]-48 > safeZone){
				vulneravel = true
			}
			else if(!personagem.jumping && personagem.position[1]-48 != 0)
				vulneravel = false
			if(vulneravel && personagem.position[1]-48 == 0){
				vulneravel = false
				vidas --
			}
			if(vidas == 0)
				gameover = true
		}
		progressBar(CTX)
		//console.log(vulneravel,vidas)

		if (gameover) {
			console.error('DEAD!!!')
			cancelAnimationFrame(animeReqReference)
		} else	animeReqReference = requestAnimationFrame(loop)

	}, 1000 / FRAMES)
}

function progressBar(ctx){
	
	ctx.save()
	ctx.globalAlpha= 1
	ctx.lineWidth = 5;
	ctx.fillStyle = "#50ff50";
	ctx.fillRect(20, 350-(maxScore*100)/900, 20, (maxScore*100)/900);
	ctx.fillStyle = "#ffff00";
	ctx.fillRect(20, 350-(score*100)/900, 20, (score*100)/900);
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000";
	ctx.strokeRect(20, 250, 20, 100);
	ctx.restore()
}

const loadLevel = async ()=>{
	
	personagem =  new Personagem([100,48],[30,65],[8,15],FRAMES)

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
	
	try {
		await Promise.all(plataformas.map(async e => e.isLoaded()))
		await personagem.isLoaded()
	} catch (error){
		console.error(`Erro ao carregar assets!`)
	}
	
}

export { init, loop }