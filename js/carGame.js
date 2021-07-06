/*!
 * Box2D Car Game Example
 * http://42games.net/html5games/box2d-car-game/
 *
 * This is an example game for the book HTML5 Games Development: A Beginning Guide.
 *
 * Copyright 2010, Thomas Seng Hin Mak
 * makzan@42games.net
 *
 * All Right Reserved.
 */

(function(){

	// Box2D alias
	var b2Vec2 = Box2D.Common.Math.b2Vec2
	, b2AABB = Box2D.Collision.b2AABB
	, b2BodyDef = Box2D.Dynamics.b2BodyDef
	, b2Body = Box2D.Dynamics.b2Body
	, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	, b2Fixture = Box2D.Dynamics.b2Fixture
	, b2World = Box2D.Dynamics.b2World
	, b2MassData = Box2D.Collision.Shapes.b2MassData
	, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	, b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
	, b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	;

	// Our logic

	// The variables needed for the car game.
	var carGame = {
		// game state constant
		STATE_STARTING_SCREEN : 1,
		STATE_PLAYING : 2,
		STATE_GAMEOVER_SCREEN : 3,

		state : 0,

		fuel: 0,
		fuelMax: 0,

		currentLevel: 0,

		isRightButtonActive: false,
		isLeftButtonActive: false
	}

	carGame.levels = new Array();
	carGame.levels[0] = [{"type":"car","x":50,"y":210,"fuel":20},
	{"type":"box","x":250, "y":270, "width":250, "height":25, "rotation":0},
	{"type":"box","x":500,"y":250,"width":65,"height":15,"rotation":-10},
	{"type":"box","x":600,"y":225,"width":80,"height":15,"rotation":-20},
	{"type":"box","x":950,"y":225,"width":80,"height":15,"rotation":20},
	{"type":"box","x":1100,"y":250,"width":100,"height":15,"rotation":0},
	{"type":"win","x":1200,"y":215,"width":15,"height":25,"rotation":0}];

	carGame.levels[1] = [{"type":"car","x":50,"y":310,"fuel":20},
	{"type":"box","x":250, "y":370, "width":250, "height":25, "rotation":0},
	{"type":"box","x":500,"y":350,"width":65,"height":15,"rotation":-10},
	{"type":"box","x":600,"y":325,"width":80,"height":15,"rotation":-20},
	{"type":"box","x":666,"y":285,"width":80,"height":15,"rotation":-32},
	{"type":"box","x":950,"y":225,"width":80,"height":15,"rotation":15},
	{"type":"box","x":1100,"y":250,"width":100,"height":15,"rotation":0},
	{"type":"win","x":1200,"y":215,"width":15,"height":25,"rotation":0}];

	carGame.levels[2] = [{"type":"car","x":50,"y":310,"fuel":50},
	{"type":"box","x":150, "y":370, "width":150, "height":25, "rotation":0},
	{"type":"box","x":300,"y":356,"width":25,"height":15,"rotation":-10},
	{"type":"box","x":500,"y":350,"width":65,"height":15,"rotation":-10},
	{"type":"box","x":600,"y":325,"width":80,"height":15,"rotation":-20},
	{"type":"box","x":666,"y":285,"width":80,"height":15,"rotation":-32},
	{"type":"box","x":950,"y":225,"width":80,"height":15,"rotation":10},
	{"type":"box","x":1100,"y":250,"width":100,"height":15,"rotation":0},
	{"type":"win","x":1200,"y":215,"width":15,"height":25,"rotation":0}];

	carGame.levels[3] = [{"type":"car","x":50,"y":210,"fuel":20},
	{"type":"box","x":100, "y":270, "width":190, "height":15, "rotation":20},
	{"type":"box","x":380, "y":320, "width":100, "height":15, "rotation":-10},
	{"type":"box","x":666,"y":285,"width":80,"height":15,"rotation":-32},
	{"type":"box","x":950,"y":295,"width":80,"height":15,"rotation":20},
	{"type":"box","x":1100,"y":310,"width":100,"height":15,"rotation":0},
	{"type":"win","x":1200,"y":275,"width":15,"height":25,"rotation":0}];


	// Level 6
	carGame.levels[4] = [{"type":"car","x":90,"y":150,"fuel":40},
	{"type":"box","x":120, "y":300, "width":200, "height":15, "rotation":0},
	{"type":"box","x":380, "y":270, "width":120, "height":15, "rotation":-20},
	{"type":"box","x":750,"y":265,"width":90,"height":15,"rotation":15},
	{"type":"box","x":870,"y":290,"width":120,"height":15,"rotation":0},
	{"type":"box","x":1120,"y":400,"width":100,"height":15,"rotation":-28},
	{"type":"box","x":800,"y":500,"width":180,"height":15,"rotation":7},
	{"type":"win","x":680,"y":450,"width":15,"height":25,"rotation":7}];

	// Level 6
	carGame.levels[5] = [{"type":"car","x":80,"y":380,"fuel":50},
	{"type":"box","x":90, "y":420, "width":250, "height":25, "rotation":0},
	{"type":"box","x":190,"y":400,"width":100,"height":15,"rotation":-15},
	{"type":"box","x":315,"y":350,"width":100,"height":15,"rotation":-30},
	{"type":"box","x":580,"y":260,"width":80,"height":15,"rotation":-30},
	{"type":"box","x":830,"y":220,"width":170,"height":15,"rotation":0},
	{"type":"box","x":1200,"y":390,"width":120,"height":15,"rotation":0},
	{"type":"box","x":1150,"y":380,"width":100,"height":15,"rotation":15},
	{"type":"box","x":730,"y":470,"width":200,"height":15,"rotation":7},
	{"type":"win","x":650,"y":415,"width":15,"height":25,"rotation":7}];

	var canvas;
	var ctx;
	var canvasWidth;
	var canvasHeight;
	var pxPerMeter = 40; // 30 pixels = 1 meter
	var shouldDrawDebug = false;

	function initGame() {

		carGame.world = createWorld();
		console.log("The world is created. ", carGame.world);


		// ! For drawing Collision
		// showDebugDraw();

		handleGameState();

		// get the reference of the context
		canvas = document.getElementById('game');
		ctx = canvas.getContext('2d');
		canvasWidth = parseInt(canvas.width);
		canvasHeight = parseInt(canvas.height);

		// setup the gameloop
		setInterval(updateWorld, 1/60);

		$(document).keydown(function(e){
			switch(e.keyCode) {
				case 39: // right arrow key to apply force towards right
				// ! Set Speed Car
					if (carGame.fuel > 0) {
						var force = new b2Vec2(400, 0);
						carGame.car.ApplyForce(force, carGame.car.GetWorldCenter());
						carGame.fuel -= 1;
						$(".fuel-value").width(carGame.fuel/carGame.fuelMax * 100 +'%');
					}
					break;
				case 37: // left arrow key to apply force towards left
					if (carGame.fuel > 0) {
						var force = new b2Vec2(-300, 0);
						carGame.car.ApplyForce(force, carGame.car.GetWorldCenter());
						carGame.fuel -= 1;
						$(".fuel-value").width(carGame.fuel/carGame.fuelMax * 100 +'%');
					}
					break;
				case 82: // r key to restart the game
					restartGame(carGame.currentLevel);
					break;
			}
		});

		handleTouchInputs();

	};

	function handleTouchInputs() {
		// Touch support
		if (!window.Touch) {
			$('.touch-control').hide();
		} else {
			$('#right-button').bind('touchstart', function(){
				if (carGame.state === carGame.STATE_STARTING_SCREEN) {
					// change the state to playing.
					carGame.state = carGame.STATE_PLAYING;

					// start new game
					restartGame(carGame.currentLevel);
				} else {
					carGame.isRightButtonActive = true;
				}
			});
			$('#left-button').bind('touchstart', function(){
				if (carGame.state === carGame.STATE_STARTING_SCREEN) {
					// change the state to playing.
					carGame.state = carGame.STATE_PLAYING;

					// start new game
					restartGame(carGame.currentLevel);
				} else {
					carGame.isLeftButtonActive = true;
				}
			});
			$('#right-button').bind('touchend', function() {
				carGame.isRightButtonActive = false;
			});
			$('#left-button').bind('touchend', function() {
				carGame.isLeftButtonActive = false;
			});
			$('#restart-button').bind('touchstart', function(){
				restartGame(carGame.currentLevel);
			})
		}
	}

	function handleGameState(){
		// set the game state as "starting screen"
		carGame.state = carGame.STATE_STARTING_SCREEN;

		// start the game when clicking anywhere in starting screen
		$('#game').click(function(){
			if (carGame.state === carGame.STATE_STARTING_SCREEN) {
				// change the state to playing.
				carGame.state = carGame.STATE_PLAYING;

				// start new game
				restartGame(carGame.currentLevel);
			}
		});
	}

	function removeAllBodies() {
		// loop all body list to destroy them
		for (var body = carGame.world.GetBodyList(); body != null; body = body.GetNext()) {
			carGame.world.DestroyBody(body);
		}

		for (var joint = carGame.world.GetJointList(); joint != null; joint = joint.GetNext()) {
			carGame.world.DestroyJoint(joint);
		}
	}

	function restartGame(level) {
		$("#level").html("Level " + (level+1));

		carGame.currentLevel = level;

		// change the background image to fit the level
		$('#game').removeClass().addClass('gamebg-level'+level);

		// destroy existing bodies.
		removeAllBodies();


		// ! Level render
		// create a ground in our newly created world
		// load the ground info from level data
		for(var i=0;i<carGame.levels[level].length;i++) {
			var obj = carGame.levels[level][i];

			// create car
			if (obj.type === "car") {
				carGame.car = createCarAt(obj.x, obj.y);
				carGame.fuel = obj.fuel;
				carGame.fuelMax = obj.fuel;
				$(".fuel-value").width('100%');
				continue;
			}
			// ! Level render
			var groundBody = createGround(obj.x, obj.y, obj.width, obj.height, obj.rotation);

			if (obj.type === "win") {
				carGame.gamewinWall = groundBody;
				groundBody.SetUserData( document.getElementById('flag') );
			}
		}
	}


	function showDebugDraw() {
		shouldDrawDebug = true;

		//setup debug draw
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById('game').getContext('2d'));
		debugDraw.SetDrawScale(pxPerMeter);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

		carGame.world.SetDebugDraw(debugDraw);

		carGame.world.DrawDebugData();
	}

	function updateWorld() {
		// Move the physics world 1 step forward.
		// ! Change this default (1/60)
		carGame.world.Step(1/100, 10, 10);

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Display the build-in debug drawing.
		if (shouldDrawDebug) {
			carGame.world.DrawDebugData();
		}

		// render graphics
		drawWorld(carGame.world, ctx);

		// Clear previous applied force.
		carGame.world.ClearForces();

		// check collision
		checkCollision();

		// apply force based on the touch event
		if (carGame.isRightButtonActive) {
			if (carGame.fuel > 0) {
				var force = new b2Vec2(10, 0);
				carGame.car.ApplyForce(force, carGame.car.GetWorldCenter());
				carGame.fuel -= 0.1;
				$(".fuel-value").width(carGame.fuel/carGame.fuelMax * 100 +'%');
			}
		} else if (carGame.isLeftButtonActive) {
			if (carGame.fuel > 0) {
				var force = new b2Vec2(-10, 0);
				carGame.car.ApplyForce(force, carGame.car.GetWorldCenter());
				carGame.fuel -= 0.1;
				$(".fuel-value").width(carGame.fuel/carGame.fuelMax * 100 +'%');
			}
		}
	}

	function checkCollision() {
		// loop all contact list to check if the car hits the winning wall
		for (var cn = carGame.world.GetContactList(); cn != null; cn = cn.GetNext()) {
			var fixtureA = cn.GetFixtureA();
			var fixtureB = cn.GetFixtureB();
			var body1 = fixtureA.GetBody();
			var body2 = fixtureB.GetBody();
			if ((body1 === carGame.car && body2 === carGame.gamewinWall) ||
				(body2 === carGame.car && body1 === carGame.gamewinWall))
			{
				if (cn.IsTouching()) {
					console.log("Level Passed!");

					if (carGame.currentLevel < carGame.levels.length - 1) {
						restartGame(carGame.currentLevel+1);
					} else {
						// show game over screen
						$('#game').removeClass().addClass('gamebg-won');

						// clear the physics world
						carGame.world = createWorld();

					}
				}
			}

		}
	}

	// Create and return the Box2D world.
	function createWorld() {
		// Define the gravity
		//! ANCHOR Change Gravity
		var gravity = new b2Vec2(0, 3);

		// set to ignore sleeping object
		var allowSleep = false;

		// finally create the world with the size, graivty and sleep object parameter.
		var world = new b2World(gravity, allowSleep);

		return world;
	}

	//!  Render Area
	// create a static ground body.
	function createGround(x, y, width, height, rotation) {
		var bodyDef = new b2BodyDef;
		var fixDef = new b2FixtureDef;

		bodyDef.type = b2Body.b2_staticBody;
		bodyDef.position.x = x /pxPerMeter;
		bodyDef.position.y = y /pxPerMeter;
		bodyDef.angle = rotation * Math.PI / 180;

		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(width/pxPerMeter, height/pxPerMeter);
		fixDef.restitution = 0.4;
		fixDef.friction = 3.5;
		console.warn(x,y,width,rotation)

		// create the body from the definition.
		var body = carGame.world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);
		console.warn(body)
		return body;
	}

	function createCarAt(x, y) {
		var bodyDef = new b2BodyDef;
		var fixDef = new b2FixtureDef;

		// car body
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = x/pxPerMeter;
		bodyDef.position.y = y/pxPerMeter;
		bodyDef.userData = document.getElementById('bus');

		fixDef.shape = new b2PolygonShape();
		fixDef.density = 1.0;
		fixDef.friction = 1.5;
		fixDef.restitution = 0.4;
		fixDef.shape.SetAsBox(40/pxPerMeter, 20/pxPerMeter);

		carBody = carGame.world.CreateBody(bodyDef);

		carBody.CreateFixture(fixDef);

		// creating the wheels
		var wheelBody1 = createWheel(x-25, y+20);
		var wheelBody2 = createWheel(x+25, y+20);

		// create a joint to connect left wheel with the car body
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(carBody, wheelBody1, new b2Vec2( (x-25)/pxPerMeter ,  (y+20)/pxPerMeter ));
		carGame.world.CreateJoint(jointDef);

		// create a joint to connect right wheel with the car body
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(carBody, wheelBody2, new b2Vec2( (x+25)/pxPerMeter ,  (y+20)/pxPerMeter ));
		carGame.world.CreateJoint(jointDef);

		return carBody;

	}

	function createWheel(x, y) {
		var bodyDef = new b2BodyDef;
		var fixDef = new b2FixtureDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = x/pxPerMeter;
		bodyDef.position.y = y/pxPerMeter;
		bodyDef.userData = document.getElementById('wheel');

		fixDef.shape = new b2CircleShape();
		fixDef.shape.SetRadius(10/pxPerMeter);

		fixDef.density = 1.0;
		fixDef.restitution = 0.1;
		fixDef.friction = 4.3;

		var body = carGame.world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		return body;
	}

	// temporary function
	function createBox() {
		var bodyDef = new b2BodyDef;
		var fixDef = new b2FixtureDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = 50/pxPerMeter;
		bodyDef.position.y = 210/pxPerMeter;

		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(20/pxPerMeter, 20/pxPerMeter);
		var body = carGame.world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		return body;
	}

	// drawing functions
	function drawWorld(world, context) {
		for (var body = carGame.world.GetBodyList(); body != null; body = body.GetNext()) {
			if (body.GetUserData() !== null && body.GetUserData() !== undefined) {
				// the user data contains the reference to the image
				var img = body.GetUserData();

				// the x and y of the image. We have to substract the half width/height
				var x = body.GetPosition().x;
				var y = body.GetPosition().y;
				var topleftX = - $(img).width()/2;
				var topleftY = - $(img).height()/2;

				context.save();
				context.translate(x * pxPerMeter,y * pxPerMeter);
				context.rotate(body.GetAngle());
				context.drawImage(img, topleftX, topleftY);
				context.restore();
			}
		}
	}

	// After all the definition, we init the game.
	initGame();


})();
