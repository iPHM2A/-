window.onload = function(){
    const canvasWidth = 900;
    const canvasHeight = 510;
    let delay = 100;
    const blockSize = 30;
    const nbWidthBlock = canvasWidth / blockSize;
    const nbHeightBlock = canvasHeight / blockSize;
    const canvas = this.document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let snake1 = new Snake();
    let apple;
    let score = 0;
    const radius = blockSize / 2;
    let time ;
    init();

    //---   function qui initialise les elements
    function init(){
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        snake1.bodySnake = [[6, 4], [5, 4], [4, 4]];
        snake1.direction = "right";
        apple = new pomme([10,10]);
        this.score = 0;
        refreshCanvas();
    }
    //---   function qui actualise le contexte du canvas
    function refreshCanvas(){
        snake1.advance();
        if(snake1.checkCollision()){
            //---   GAME OVER
            gameOver();
        }else{
            if (snake1.isEatingApple(apple)){
                //---   le serpent a mange la pomme
                snake1.ateApple = true;
                this.score += 5;
                do {
                    apple.setNewPosition();
                } while (apple.isOnSnake(snake1))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snake1.draw();
            apple.draw();
            time = setTimeout(refreshCanvas, delay);
        }
    }
    //---   function game over
    function gameOver(){
        ctx.save();
        let centreX = canvasWidth / 2;
        let centreY = canvasHeight / 2;;
        ctx.font = "bold 40px  sans-serif";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1,5; 
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.strokeText("GAME OVER", centreX, centreY - 180);ctx.fillText("GAME OVER", centreX, centreY - 180 );
        ctx.font = "bold 40px  sans-serif";
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }
    //---   function restart
    function restart() {
        snake1.bodySnake = [[6, 4], [5, 4], [4, 4]];
        snake1.direction = "right";
        apple = new pomme([10, 10]);
        this.score = 0;
        clearTimeout(time);
        refreshCanvas();
    }
    //---   function drawing score
    function drawScore() {
        ctx.save();
        ctx.font = "bold 53px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        let centreX = canvasWidth/2;
        let centreY = canvasHeight/2;;
        ctx.fillText("SCORE : " + this.score.toString(), centreX, centreY);
        ctx.restore();
    }
    //---   function prototype of snake
    function Snake(bodySnake,direction){
        this.bodySnake = bodySnake;
        this.direction = direction;
        this.ateApple = false;
        //----------------------
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#000000";
            for(let i = 0 ; i < this.bodySnake.length; i++)
            {
                drawBlock(ctx, this.bodySnake[i]);
            }
            ctx.restore();
        }
        //-------------------------
        this.advance = function(){
            let nextPos = this.bodySnake[0].slice();
            switch(this.direction)
            {
                // case "right":
                //     nextPos[0] = ++nextPos[0] % (canvasWidth / blockSize);
                //     break;
                // case "left":
                //     nextPos[0] = (nextPos[0] == 0) ?
                //         (canvasWidth / blockSize) : --nextPos[0];
                //     break;
                // case "up":
                //     nextPos[1] = (nextPos[1] == 0) ?
                //         (canvasHeight / blockSize) : --nextPos[1];
                //     break;
                // case "down":
                //     nextPos[1] = ++nextPos[1] % (canvasHeight / blockSize);
                //     break;
                case "right":
                    ++nextPos[0];
                    break;
                case "left":
                    --nextPos[0];
                    break;
                case "up":
                    --nextPos[1];
                    break;
                case "down":
                    ++nextPos[1];
                    break;
                default:
                    throw ("invalid direction");
            }
            this.bodySnake.unshift([nextPos[0], nextPos[1]]);
            if(!this.ateApple)
                this.bodySnake.pop();
            else
                this.ateApple = false;
        }
        //------------------------------------------
        this.setDirection = function(newDirection){
            let allowedDirection;
            switch(this.direction)
            {
                case "right":
                case "left":
                    allowedDirection = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    return;
            }
            if (allowedDirection.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        }
        //-------------------------
        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.bodySnake[0];
            let rest = this.bodySnake.slice(1);
            let xCoordSnake = head[0];
            let yCoordSnake = head[1];
            let xCoordMin = 0;
            let yCoordMin = 0;
            let xCoordMax = nbWidthBlock - 1;
            let yCoordMax = nbHeightBlock-1;
            let isNotBetweenHorizontalWalls = xCoordSnake < xCoordMin || xCoordSnake > xCoordMax;
            let isNotBetweenVerticalWalls = yCoordSnake < yCoordMin || yCoordSnake > yCoordMax;
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }
            for(let i=2; i<rest.length;i++){
                if (xCoordSnake === rest[i][0] && yCoordSnake === rest[i][1])
                    snakeCollision = true;
            }
            return wallCollision || snakeCollision;
        }
        //------------------------------------------
        this.isEatingApple = function(appleToEat){
            let head = this.bodySnake[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) return true;
            else false;
        }
        //------------------------------------------
    }
    //---   function drawi ng blocks of snake body
    function drawBlock(ctx,position){
        let xCoord = position[0] * blockSize;
        let yCoord = position[1] * blockSize;
        ctx.fillRect(xCoord, yCoord, blockSize, blockSize);
    }
    //---   function prototype of apple
    function pomme(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            ctx.beginPath();
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        }
        //-----------------------
        this.setNewPosition = function(){
            let newX = Math.round(Math.random() * (nbWidthBlock-1));
            let newY = Math.round(Math.random() * (nbHeightBlock - 1));
            this.position = [newX,newY];
        }
        this.isOnSnake = function(snakeToCheck){
            var onSnake = false;
            for(var i = 0; i<snakeToCheck.bodySnake.length; i++){
                if (this.position[0] === snakeToCheck.bodySnake[i][0] && this.position[1] === snakeToCheck.bodySnake[i][1]){
                    onSnake = true;
                }
            }
            return onSnake;
        }
    }
    //---   event of pressing direction key
    document.onkeydown = function handleKeyDown(e){
        let key = e.keyCode;
        // alert(key);
        let newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snake1.setDirection(newDirection);
    }
}