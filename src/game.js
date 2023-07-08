
import Personagem from "./Personagem";
import Plataforma from "./Plataforma";
import { keyPress, keys } from "./keyboard"

const TETOSCORE = 900
const FRAMES = 60

let CTX
let CANVAS
let gameover = false;
let animeReqReference;
let personagem;
let boundaries;
let ctxPosition = {x:0,y:0};
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
	ctxPosition = {x:0,y:CANVAS.height}
	boundaries = {
		width: 48*30,
		height: 1000
	}

	fetch('/level.json')
    .then((response) => response.json())
	.then((json) => loadLevel(json))
	.then(()=>{loop()});

	//loadLevel().then(()=>{loop()})
	keyPress(window)
}


const loop = () => {
	setTimeout(() => {
		CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
		
		personagem.move(boundaries, keys, plataformas);	

		ctxPosition.x = personagem.position.x + personagem.size.x/2 - CANVAS.width/2
		ctxPosition.y = CANVAS.height + personagem.position.y-200
		
		if(ctxPosition.x < 0)
			ctxPosition.x = 0
		if(ctxPosition.x > 48*30-CANVAS.width)
			ctxPosition.x = 48*30-CANVAS.width
		if(ctxPosition.y < 600)
			ctxPosition.y = 600

		personagem.draw(CTX,ctxPosition);

		plataformas.forEach(plataforma =>{
			if(plataforma.colide(CANVAS,ctxPosition))
				plataforma.draw(CTX,ctxPosition)
		})



		if(!personagem.jumping)
			score = personagem.position.y-48
		if(score > TETOSCORE)
			score = TETOSCORE
		if(score>maxScore)
			maxScore = score

		if(vidas>=0){
			if(personagem.position.y-48 > safeZone){
				vulneravel = true
			}
			else if(!personagem.jumping && personagem.position.y-48 != 0)
				vulneravel = false
			if(vulneravel && personagem.position.y-48 == 0){
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
	ctx.fillRect(20, 350-(maxScore*100)/TETOSCORE, 20, (maxScore*100)/TETOSCORE);
	ctx.fillStyle = "#ffff00";
	ctx.fillRect(20, 350-(score*100)/TETOSCORE, 20, (score*100)/TETOSCORE);
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000";
	ctx.strokeRect(20, 250, 20, 100);
	ctx.restore()
}

const loadLevel = async (json)=>{
	
	console.log(json.Level)
	personagem =  new Personagem(json.Level.Personagem[0],json.Level.Personagem[1],FRAMES)

	json.Level.Plataformas.forEach(p=>{
		plataformas.push(new Plataforma(p[0],p[1],p[2]))
	})
	
	try {
		await Promise.all(plataformas.map(async e => e.isLoaded()))
		await personagem.isLoaded()
	} catch (error){
		console.error(`Erro ao carregar assets!`)
	}
	
}

export { init, loop }