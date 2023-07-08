
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

	loadLevel().then(()=>{loop()})
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

const loadLevel = async ()=>{
	
	personagem =  new Personagem({x:100,y:48},{x:30,y:65},{x:8,y:15},FRAMES)

	plataformas.push(new Plataforma({x: 0,y: 0},{x: 48,y: 48*30},"leftWall"))
	plataformas.push(new Plataforma({x: 48*29,y: 0},{x: 48,y: 48*30},"rigthWall"))
	plataformas.push(new Plataforma({x: 0,y: 0},{x: 48*30,y: 48},"floor"))
	
	plataformas.push(new Plataforma({x: 400,y: 150},{x: 48*3,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 650,y: 250},{x: 48*5,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 170,y: 320},{x: 48*5,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 250,y: 450},{x: 48*2,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 690,y: 470},{x: 48*2,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 1100,y: 470},{x: 48*2,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 48*28,y: 500},{x: 48,y: 48*2},"leftBlock"))
	plataformas.push(new Plataforma({x: 1100,y: 48},{x: 48*4,y: 48*2},"bottonBlock"))
	plataformas.push(new Plataforma({x: 930,y: 710},{x: 48*4,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 600,y: 830},{x: 48*2,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 200,y: 850},{x: 48*2,y: 16},"plataform"))
	plataformas.push(new Plataforma({x: 48,y: 900},{x: 48,y: 48*2},"rigthBlock"))
	
	try {
		await Promise.all(plataformas.map(async e => e.isLoaded()))
		await personagem.isLoaded()
	} catch (error){
		console.error(`Erro ao carregar assets!`)
	}
	
}

export { init, loop }