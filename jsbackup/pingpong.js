(function($){

  // data definition
  var pingpong = {
  	scoreA : 0, // score for player A
	scoreB : 0, // score for player B
    paddleA: {
      x: 50,
      y: 100,
      width: 20,
      height: 70
    },
    paddleB: {
      x: 320,
      y: 100,
      width: 20,
      height: 70
    },
    playground: {
      offsetTop: $("#playground").offset().top,
      height: parseInt($("#playground").height()),
      width: parseInt($("#playground").width()),
    },
    ball: {
      speed: 7,
      x: 150,
      y: 100,
      radius: 20,
      directionX: 1,
      directionY: 1
    }
    
  };

  // ball collision logic
  function ballHitsTopBottom() {
    var y = pingpong.ball.y + pingpong.ball.speed * pingpong.ball.directionY;
    return y < 0 || y > pingpong.playground.height;
  }

  function ballHitsRightWall() {
    return pingpong.ball.x + pingpong.ball.speed * pingpong.ball.directionX > pingpong.playground.width;
  }
  function ballHitsLeftWall() {
    return pingpong.ball.x + pingpong.ball.speed * pingpong.ball.directionX < 0;
  }

  // ball movement logic
  function moveBall() {
    // reference useful varaibles
    var ball = pingpong.ball;

    // check playground top/bottom boundary
    if (ballHitsTopBottom()) {
      // reverse direction
      ball.directionY *= -1;
    }

    // check right
    if (ballHitsRightWall()) {
      playerAWin();
    }
    // check left
    if (ballHitsLeftWall()) {
      playerBWin();
    }

   // Variables for checking paddles
	var ballX = ball.x + ball.speed * ball.directionX;
	var ballY = ball.y + ball.speed * ball.directionY;
	// check moving paddle here, later.
	// check left paddle
	if (ballX >= pingpong.paddleA.x && ballX < pingpong.paddleA.x +
	pingpong.paddleA.width) {
	if (ballY <= pingpong.paddleA.y + pingpong.paddleA.height &&
	ballY >= pingpong.paddleA.y) {
	ball.directionX = 1;
	}
	}
	// check right paddle
	if (ballX + pingpong.ball.radius >= pingpong.paddleB.x && ballX
	< pingpong.paddleB.x + pingpong.paddleB.width) {
	if (ballY <= pingpong.paddleB.y + pingpong.paddleB.height &&
	ballY >= pingpong.paddleB.y) {

	ball.directionX = -1;
	}
	}


    // update the ball position data
    ball.x += ball.speed * ball.directionX;
    ball.y += ball.speed * ball.directionY;
  }



  // winning logic
  function playerAWin() {
    // reset the ball;
    pingpong.ball.x = 250;
    pingpong.ball.y = 100;

    //player b Lost
    pingpong.scoreA+=2;
    $("#score-a").text(pingpong.scoreA);

    // update the ball location variables;
    pingpong.ball.directionX = -1;
  }
  function playerBWin() {
    // reset the ball;
    pingpong.ball.x = 150;
    pingpong.ball.y = 100;

    // player A lost.
	pingpong.scoreB += 2;
	$("#score-b").text(pingpong.scoreB);

    // update the ball location variables;
    pingpong.ball.directionX = 1;
  }

  function autoMovePaddleA() {
    var speed = 4;
    var direction = 1;

    var paddleY = pingpong.paddleA.y + pingpong.paddleA.height/2;
    if (paddleY > pingpong.ball.y) {
      direction = -1;
    }

    pingpong.paddleA.y += speed * direction;
  }

  // view rendering
  function renderPaddles() {
    $("#paddleB").css("top", pingpong.paddleB.y);
    $("#paddleA").css("top", pingpong.paddleA.y);
  }

  function renderBall() {
    var ball = pingpong.ball;
    $("#ball").css({
      "left" : ball.x + ball.speed * ball.directionX,
      "top" : ball.y + ball.speed * ball.directionY
    });
  }


  // view inputs
  function handleMouseInputs() {
    // run the game when mouse moves in the playground.
    $('#playground').mouseenter(function(){
      pingpong.isPaused = false;
    });

    // pause the game when mouse moves out the playground.
    $('#playground').mouseleave(function(){
      pingpong.isPaused = true;
    });

    // calculate the paddle position by using the mouse position.
    $('#playground').mousemove(function(e){
      pingpong.paddleB.y = e.pageY - pingpong.playground.offsetTop;
    });
  }

  // browser render loop
  function render() {
    renderBall();

    renderPaddles();

    window.requestAnimationFrame(render);
  }

  function gameloop() {
    moveBall();
    autoMovePaddleA();
  }


  // starting point of entire game
  function init() {

    // set interval to call gameloop logic in 30 FPS
    pingpong.timer = setInterval(gameloop, 1000/30);

    // view rendering
    window.requestAnimationFrame(render);

    // inputs
    handleMouseInputs();
  }

  // Execute the starting point
  init();

})(jQuery);
