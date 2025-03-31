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
        bgSound.currentTime = 0;
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
        food = generateFood();
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
bgSound.loop = true;
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
    // Only allow arrow keys to start the game
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        return; 
    }

    if (bgSound.paused) {
        bgSound.play(); // Start background music if not playing
    }

    inputDirection={x:0,y:1};
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            //console.log("ArrowUp")
            inputDirection.x=0;
            inputDirection.y=-1;
            break;
        case "ArrowDown":
            //console.log("ArrowDown")
            inputDirection.x=0;
            inputDirection.y=1;
            break;
        case "ArrowLeft":
            //console.log("ArrowLeft")
            inputDirection.x=-1;
            inputDirection.y=0;
            break;
        case "ArrowRight":
            //console.log("ArrowRight")
            inputDirection.x=1;
            inputDirection.y=0;
            break;
        default:
            break;
    }
})

function generateFood() {
    let a = 2, b = 16;
    let newFood;
    let isOnSnake;

    do {
        // Generate new food position
        newFood = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };

        // Check if the food is on the snake
        isOnSnake = snakeArr.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isOnSnake); // Keep generating new positions until it's NOT on the snake

    return newFood;
}
// Theme styles
const themes = {
    jungle: {
        snakeHead: "radial-gradient(circle, #00FF00 40%, #006400 90%)",
        snakeBody: "linear-gradient(to right, #228B22, #556B2F)",
        food: "radial-gradient(circle, #FF4500, #B22222)",
        bodyBg: "linear-gradient(to bottom, #135E46, #228B22)",
        boardBg: "linear-gradient(to bottom,rgb(208, 247, 136),rgb(185, 255, 232))"
    },
    neon: {
        snakeHead: "radial-gradient(circle, #00FFFF, #008080)",
        snakeBody: "linear-gradient(to right, #8A2BE2, #4B0082)",
        food: "radial-gradient(circle, #FFA500, #FF4500)",
        bodyBg: "linear-gradient(to bottom, #2F4F4F, #000080)",
        boardBg: "linear-gradient(to bottom,rgb(142, 247, 247),rgb(200, 200, 255))"
    },
    desert: {
        snakeHead: "radial-gradient(circle, #C19A6B, #8B5A2B)",
        snakeBody: "linear-gradient(to right, #FFD700, #FF8C00)",
        food: "radial-gradient(circle, #32CD32, #228B22)",
        bodyBg: "linear-gradient(to bottom,rgb(53, 23, 2),rgb(80, 68, 3))",
        boardBg: "linear-gradient(to bottom,rgb(243, 200, 152),rgb(255, 244, 184))"
    }
};

// Track current theme
let currentTheme = "jungle";

// Function to apply theme
function applyTheme(themeName) {
    let theme = themes[themeName];

    document.documentElement.style.setProperty("--snake-head", theme.snakeHead);
    document.documentElement.style.setProperty("--snake-body", theme.snakeBody);
    document.documentElement.style.setProperty("--food", theme.food);
    document.documentElement.style.setProperty("--board", theme.boardBg);
    document.querySelector(".body").style.background= theme.bodyBg;
}

// Change theme on button click
document.getElementById("themeToggle").addEventListener("click", () => {
    let themeKeys = Object.keys(themes);
    let currentIndex = themeKeys.indexOf(currentTheme);
    let nextIndex = (currentIndex + 1) % themeKeys.length;
    currentTheme = themeKeys[nextIndex];
    applyTheme(currentTheme);
});

// Set initial theme
applyTheme(currentTheme);

//Adding mute sound feature
const muteButton = document.getElementById('muteButton');
const muteIcon = document.getElementById('muteIcon');

muteButton.addEventListener('click', () => {
    bgSound.muted = !bgSound.muted;
    muteIcon.classList.toggle('fa-volume-up');
    muteIcon.classList.toggle('fa-volume-mute');
});
