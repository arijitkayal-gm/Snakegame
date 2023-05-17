//Game constants and variables
let inputDirection={x:0,y:0};
const foodSound=new Audio("Gulp.mp3");
const gameOverSound=new Audio("death.mp3");
const moveSound=new Audio("movesound.mp3");
const bgSound=new Audio("bgm.mp3");
let speed=5;
let score = 0;
let lastPaintTime=0;
let snakeArr=[{x:13,y:15}];
let food={x:5,y:8};

//Game func
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000<1/speed){
        return
    }
    lastPaintTime=ctime;
    gameEngine();
    //console.log(ctime);
    
}

function isCollide(snake){
    //collide snakebody
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x=== snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    //collide wall
    if (snake[0].x >=18 || snake[0].x<=0 || snake[0].y>=18 || snake[0].y<0) {
        return true;
    }
    return false;
}

function gameEngine(){
    //1: Updating snake array and food
    //1.1when snake hits itself or wall
    if(isCollide(snakeArr)){
        gameOverSound.play();
        bgSound.pause();
        inputDirection={x:0,y:0};
        alert("Game over. Press any key to start the game again!");
        snakeArr=[{x:13,y:15}];
        bgSound.play();
        score=0;
        scoreBox.innerHTML="Score:" +score;
    }

    //1.2 When snake eats food
    if (snakeArr[0].x===food.x && snakeArr[0].y===food.y) {
        foodSound.play();
        score+=1;
        if(score>highscorevalue){
            highscorevalue=score;
            localStorage.setItem("highscore",JSON.stringify(highscorevalue));
            highScoreBox.innerHTML="High Score:"+ highscorevalue;
        }
        scoreBox.innerHTML="Score:" +score;
        snakeArr.unshift({x:snakeArr[0].x+inputDirection.x, y:snakeArr[0].y+inputDirection.y});
        let a=2;
        let b=16;
        food={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())};
    }

    //Move the snake (by cloning the previous element's object to the last element's object)
    for (let i=snakeArr.length-2; i>=0; i--) {
        snakeArr[i+1]={...snakeArr[i]};
    }
    snakeArr[0].x+=inputDirection.x;
    snakeArr[0].y+=inputDirection.y;

    //2: Display snake array and food
    //2.1 Display snake
    board.innerHTML="";
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement("div");
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;
        if(index===0){
            snakeElement.classList.add("snakehead"); 
        }
        else{
            snakeElement.classList.add("snakebody");
        }
        board.appendChild(snakeElement);
    })
    //2.2 Display food
    foodElement=document.createElement("div");
    foodElement.style.gridRowStart=food.y;
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);

}

//Main logic
bgSound.play();
//highscore
let highscore=localStorage.getItem("highscore");
if(highscore===null){
    highscorevalue=0;
    localStorage.setItem("highscore",JSON.stringify(highscorevalue));
}else{
    highscorevalue=JSON.parse(highscore);
    highScoreBox.innerHTML="High Score:"+ highscore;
}

window.requestAnimationFrame(main);
document.addEventListener("keydown",(e)=>{
    inputDirection={x:0,y:1};
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp")
            inputDirection.x=0;
            inputDirection.y=-1;
            break;
        case "ArrowDown":
            console.log("ArrowDown")
            inputDirection.x=0;
            inputDirection.y=1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft")
            inputDirection.x=-1;
            inputDirection.y=0;
            break;
        case "ArrowRight":
            console.log("ArrowRight")
            inputDirection.x=1;
            inputDirection.y=0;
            break;
        default:
            break;
    }
})