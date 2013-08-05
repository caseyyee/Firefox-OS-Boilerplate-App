
var box2d = { 
	b2Vec2 : Box2D.Common.Math.b2Vec2,
     b2BodyDef : Box2D.Dynamics.b2BodyDef,
     b2Body : Box2D.Dynamics.b2Body,
     b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
     b2Fixture : Box2D.Dynamics.b2Fixture,
     b2World : Box2D.Dynamics.b2World,
     b2MassData : Box2D.Collision.Shapes.b2MassData,
     b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
     b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
     b2DebugDraw : Box2D.Dynamics.b2DebugDraw
};

var SCALE = 30;
var stage, world;
var stageSize;

var canvas = document.getElementById("Physics1Canvas");

function init() {
	stage = new createjs.Stage(canvas);

	stageSize = {
		width: canvas.width,
		height: canvas.height
	}
	setupPhysics();

	stage.onMouseDown = createRoundBody;

	createjs.Ticker.addListener(this);	
	createjs.Ticker.setFPS(60);	
	createjs.Ticker.useRAF = true;
};

function createRoundBody() {
	var fixDef  = new box2d.b2FixtureDef();
	fixDef.density = 1;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.5;
	var bodyDef = new box2d.b2BodyDef();
	bodyDef.type = box2d.b2Body.b2_dynamicBody;
	bodyDef.position.x = Math.random()*stageSize.width / SCALE;
	bodyDef.position.y = 0
	fixDef.shape = new box2d.b2CircleShape(Math.random()*50 / SCALE);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function setupPhysics() {
	world = new box2d.b2World(new box2d.b2Vec2(0, 50)	// gravity vector
										, true);		// allow bodies to sleep

	// create ground
	var fixDef  = new box2d.b2FixtureDef();
	fixDef.density = 1;
	fixDef.friction = 0.5;
	var bodyDef = new box2d.b2BodyDef();
	bodyDef.type = box2d.b2Body.b2_staticBody;
	bodyDef.position.x = stageSize.width / SCALE;
	bodyDef.position.y = stageSize.height / SCALE;
	fixDef.shape = new box2d.b2PolygonShape();
	fixDef.shape.SetAsBox(stageSize.width / SCALE, 10 / SCALE);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	// setup debug drag
	var debugDraw = new box2d.b2DebugDraw();
	debugDraw.SetSprite(stage.canvas.getContext('2d'));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_joinBit);
	world.SetDebugDraw(debugDraw);
};

function tick() {
	stage.update();
	world.DrawDebugData();
	world.Step(1/60 // frame rate
			, 10	// velocity iterations
			, 10);	// position iterations
	world.ClearForces();
};

window.onload = init;