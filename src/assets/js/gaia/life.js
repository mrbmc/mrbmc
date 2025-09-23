let DEBUG = (document.location.hostname == "localhost" || document.location.href.includes('debug'));

//ANIMATION MANAGEMENT
var oFPS = {
	fps: 30,
	now: window.performance.now(),
	prev: window.performance.now(),
	timeout: {},
	generations: 0
}

// CANVAS MANAGEMENT
const context = document.getElementsByTagName("canvas")[0].getContext("2d");
let width = 150;
let height = 150;

class GameWorld 
{
	static mortalityRate = 1;// % of death each generation
	static initialPopulation = 50;// % of cells to start with
	static maxCells = 1000;
	// static numCells = 0;
	static aliveCells = 0;
	static changesNow = 0;
	static changesPrev = 0;
	static minPopulation = 3.2;
	static numRows = 60;
	static numColumns = 100;
	static cells = [];

	static neighbourCellsMap = [
	    [-1,-1], [0,-1], [1,-1],
	    [-1, 0],         [1, 0],
	    [-1, 1], [0, 1], [1, 1]
	];

	constructor (context) 
	{
		console.log("GameWorld.constructor");
	}

	static get numCells() {
		return (this.numColumns * this.numRows);
	}
}


class Cell
{
    // Set the default size and color for each cell
    static width = 10;
    static height = 10;
    static colorAlive = '#00CCCC';
    static colorDead = '#00CCCC11';
    static shape = "circle";

    // static isAlive = false;
    // static isAliveNextFrame = false;

    constructor (gridX, gridY)
    {
        // Store the position of this cell in the grid
        this.gridX = gridX;
        this.gridY = gridY;

        this.lifespan = window.performance.now();

        // Make random cells alive
        this.isAlive = this.isAliveNextFrame = Math.random() > (1 - GameWorld.initialPopulation / 100);
    }

    draw() {
        context.fillStyle = this.isAlive ? Cell.colorAlive : Cell.colorDead;

        switch(Cell.shape) {
        case "circle":
	        var r = (Cell.width/4);
	        var x = (this.gridX * Cell.width) + r;
	        var y = (this.gridY * Cell.height) + r;

			// this.context.translate(x, y);
			context.beginPath();
			context.arc(x, y, r, 0, 360, false);
			context.fill();
    	break;
        default:
	        // context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height);
			context.beginPath();
	        context.roundRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height, (Cell.width/4));
	        context.fill();
    	break;
        }
    }
}

function sizeCanvas() {

	const canvas = document.getElementsByTagName("canvas")[0];
	canvas.width = width = window.innerWidth;
	canvas.height = height = window.innerHeight;

	var screenArea = width * height;
	var cellArea = screenArea / GameWorld.maxCells;
	////uncomment this if you need to limit the cells due to performance concerns
	// Cell.width = Cell.height = Math.ceil(Math.sqrt(cellArea));

	GameWorld.numColumns = Math.ceil(width / Cell.width);
	GameWorld.numRows = Math.ceil(height / Cell.height);

	if(DEBUG) console.log("sizeCanvas",);
}

function createGrid()
{
	console.log("createGrid",GameWorld.numRows + "x" + GameWorld.numColumns + "=" + GameWorld.numCells);
 	GameWorld.cells = [];
    for (let y = 0; y < GameWorld.numRows; y++) {
        for (let x = 0; x < GameWorld.numColumns; x++) {
            GameWorld.cells.push(new Cell(x, y));
        }
    }
    // GameWorld.numCells = GameWorld.cells.length;
}

function updateCells() {
    // Loop over all cells and calculate the amount of alive neighbours
    for (let x = 0; x < GameWorld.numColumns; x++) {
        for (let y = 0; y < GameWorld.numRows; y++) {
			var r = Math.random(),
				c = GameWorld.mortalityRate/100;
            var numAliveNeighbours = getNumAliveNeighbours(x, y)

		    let centerCell = GameWorld.cells[this.gridToIndex(x, y)];

			if (numAliveNeighbours == 2){
			    // Do nothing
			    centerCell.isAliveNextFrame = centerCell.isAlive;
			}else if (numAliveNeighbours == 3){
			    // Make alive
			    centerCell.isAliveNextFrame = true;
			}else{
			    // Make dead
			    centerCell.isAliveNextFrame = false;
			}

        }
    }

    GameWorld.aliveCells = 0;
    GameWorld.changesNow = 0;
	// Apply the new state to all the cells at once
	for(n = 0;n < GameWorld.numCells; n++) {
		if(GameWorld.cells[n].isAlive != GameWorld.cells[n].isAliveNextFrame)
			GameWorld.changesNow++;
		if(GameWorld.cells[n].isAliveNextFrame)
			GameWorld.aliveCells++;
		GameWorld.cells[n].isAlive = GameWorld.cells[n].isAliveNextFrame;
		// GameWorld.aliveCells += (GameWorld.cells[n].isAlive) ? 1 : 0;
	}
}

function getNumAliveNeighbours(x, y) {
    // Check every surrounding cell, using the neighbourCellsMap
    return GameWorld.neighbourCellsMap.reduce(
    	(numNeighbours, [dx, dy]) => {
	        return numNeighbours + (isCellAlive(x + dx, y + dy) ? 1 : 0);
    	}, 
	0);
}

function isCellAlive(x, y) {
    // Respect grid boundaries
    if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows){
        return false;
    }

    return GameWorld.cells[gridToIndex(x, y)].isAlive;
}

function gridToIndex(x, y){
    return x + (y * GameWorld.numColumns);
}

function drawCells () {

    // Clear the screen
    context.clearRect(0, 0, width, height);

    // Draw all the gamecells
    GameWorld.cells.forEach((gameCell) => {
      gameCell.draw();
    });

}

function animationLoop (argument) {
	// if(DEBUG) console.log("animationLoop")

	// FRAME SCHEDULING
	oFPS.now = window.performance.now();
	var msPassed = oFPS.now - oFPS.prev;
	// set FPS to program spec
	oFPS.timeout = setTimeout(animationLoop, 1000/oFPS.fps);
	if (msPassed < (1000 / oFPS.fps)) return;
	// set FPS to display refresh rate
	// requestAnimationFrame(animationLoop);

    updateCells();
    drawCells();


    // if(GameWorld.changesNow == GameWorld.changesPrev && GameWorld.changesNow<100)
	// 	initGame();
	// else
	// 	GameWorld.changesPrev = GameWorld.changesNow;

    // var pAlive = Math.round(GameWorld.aliveCells / GameWorld.numCells * 10000)/100;
	// if(pAlive <= GameWorld.minPopulation || oFPS.generations >= 1200) {
		// setTimeout(initGame,5000);
	// }

	oFPS.prev = oFPS.now;
	oFPS.generations++;
	updateStats(1000 / msPassed);


}

function updateStats(_fps) {
  var str = "fps: " + Math.round(_fps) + "\n";
      str +="gen: " + oFPS.generations + "\n";
      str +="obj: " + GameWorld.numCells + "\n";
      str +="alv: " + (Math.round(GameWorld.aliveCells / GameWorld.numCells * 10000)/100) + "%\n";
      str +="chg: " + GameWorld.changesNow;

	document.getElementById("debugger").textContent = str;
	document.getElementById("debugger").style.display = DEBUG?"block":"none";

}


function initGame(argument) {
	if(DEBUG) console.log("initGame")

	oFPS.generations = 0;
	clearTimeout(oFPS.timeout);

	sizeCanvas();

	createGrid();
	drawCells();

	// Schedule the main animation loop
	window.requestAnimationFrame(animationLoop);

	setTimeout(initGame,60000);
}

window.onload = () => {
	window.addEventListener("resize", sizeCanvas, false);

	initGame();

    document.getElementById('debugger').style.display = (DEBUG) ? "block" : "none";
    document.getElementById('controls').style.display = (DEBUG) ? "block" : "none";
};
window.addEventListener('keydown', function(e){ 
		console.log("keydown",e.keyCode);
	switch(e.keyCode) {
		case 68://escape
			DEBUG = !DEBUG;
			break;
		default:
	}

})
