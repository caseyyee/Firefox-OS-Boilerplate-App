
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

var canvas = document.getElementById("Physics1Canvas");		// canvas element for physics
var container = document.getElementById("Physics1");		// dom element for physics

function init() {
	stage = new createjs.Stage(canvas);
	
	stageSize = {
		width: container.offsetWidth,
		height: container.offsetHeight
	}
	
	setupPhysics();

	//stage.onMouseDown = createRoundBody;
	container.addEventListener("click", createRoundBody)

	createjs.Ticker.addListener(this);	
	createjs.Ticker.setFPS(30);	
	createjs.Ticker.useRAF = true;
};

function createRoundBody() {
	var body = {
		x: Math.random()*stageSize.width,	// randomly on X-axis
		y: 0,								// from the top @ 0
		diam: Math.random()*50
	}

	var fixDef  = new box2d.b2FixtureDef();
	fixDef.density = 1;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.5;
	var bodyDef = new box2d.b2BodyDef();
	bodyDef.type = box2d.b2Body.b2_dynamicBody;
	bodyDef.position.x = body.x/SCALE;
	bodyDef.position.y = body.y;
	fixDef.shape = new box2d.b2CircleShape(body.diam/SCALE);
	var b2body = world.CreateBody(bodyDef).CreateFixture(fixDef);

	// create coresponding dom element
	var elem = document.createElement("div");
	elem.style.position = "absolute";
	elem.style.width = Math.round(body.diam*2)+"px";
	elem.style.height = Math.round(body.diam*2)+"px";
	elem.style.borderRadius = "50%";
	elem.style.background = "black";
	container.appendChild(elem);
	// add user data reference to box2d body def
	b2body.m_userData = { domElem: elem }; 
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
	//world.DrawDebugData();
	world.Step(1/60 // frame rate
			, 10	// velocity iterations
			, 10);	// position iterations
	world.ClearForces();

	updateDom();
};

function updateDom() {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var f = b.m_fixtureList; f; f = f.m_next) {
			if (f.m_userData) {
				//console.log(f.m_userData.domElem.offsetWidth);
				var x = Math.floor((f.m_body.m_xf.position.x * SCALE));
				var y = Math.floor((f.m_body.m_xf.position.y * SCALE));
				f.m_userData.domElem.style["left"] = x-(f.m_userData.domElem.offsetWidth/2)+"px";
				f.m_userData.domElem.style["top"] = y-(f.m_userData.domElem.offsetHeight/2)+"px";
			}
		}
	}
};

window.onload = init;