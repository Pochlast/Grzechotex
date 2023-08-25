document.querySelector(".home-btn").addEventListener('click', goHome)
document.querySelector(".play-btn").addEventListener('click', startRattle)

function goHome() {
    document.querySelector(".home-view").style["display"] = "block";
    document.querySelector(".rattle-view").style["display"] = "none";

    BALLZ = []
    WALLZ = []
}

document.querySelector("#quantity").oninput = function () {
    document.querySelector(".quantity-range").innerHTML = this.value;
}

function startRattle() {
    let quantity = document.querySelector("#quantity").value;
    let size = document.querySelector("#one").checked;

    console.log(quantity);
    console.log(size);
    document.querySelector(".home-view").style["display"] = "none";
    document.querySelector(".rattle-view").style["display"] = "block";

    for (let i = 0; i < quantity; i++) {
        let newBall = new Ball(randInt(100, 500), randInt(50, 400), size ? 20 : randInt(20, 50), randInt(0, 10));
        newBall.elasticity = randInt(0, 10) / 10;
    }

    let edge1 = new Wall(0, 0, canvas.width, 0);
    let edge2 = new Wall(canvas.width, 0, canvas.width, canvas.height);
    let edge3 = new Wall(canvas.width, canvas.height, 0, canvas.height);
    let edge4 = new Wall(0, canvas.height, 0, 0);
    BALLZ[0].player = true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let BALLZ = [];
let WALLZ = [];

//var audio = new Audio('./grzechotka_2.mp3');

let LEFT, UP, RIGHT, DOWN;
let friction = 0.001;
let coef_restitution = 0.90;
let coef_ability = 3.5;



let right_wall = screen.width-100;
let bottom_wall = screen.height-100;

ctx.canvas.width  = window.right_wall;
ctx.canvas.height = window.bottom_wall;
console.log(bottom_wall)
let vel_lim = 3;
const acl = new Accelerometer({ frequency: 600 });

acl.start();

let acc_x_test = 0;

const wersja = 35;

let acc_x = -acl.x;
let acc_y = acl.y;


document.getElementsByClassName("acc_x_test")[0].innerHTML = acc_x_test

document.getElementsByClassName("wersja")[0].innerHTML = wersja

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtr(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    mult(n) {
        return new Vector(this.x * n, this.y * n);
    }

    normal() {
        return new Vector(-this.y, this.x).unit();
    }

    unit() {
        if (this.mag() === 0) {
            return new Vector(0, 0);
        } else {
            return new Vector(this.x / this.mag(), this.y / this.mag());
        }
    }

    drawVec(start_x, start_y, n, color) {
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
}

class Ball {
    constructor(x, y, r, m) {
        this.pos = new Vector(x, y);
        this.r = r;
        this.m = m;
        if (this.m === 0) {
            this.inv_m = 0;
        } else {
            this.inv_m = 1 / this.m;
        }
        this.elasticity = 1;
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.acceleration = 3;
        this.player = true;
        this.soundAbilityHorizontal = true;
        this.soundAbilityVertical = true;
        BALLZ.push(this);
    }

    drawBall() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    display() {
        this.vel.drawVec(this.pos.x, this.pos.y, 10, "green");
        ctx.fillStyle = "black";
        ctx.fillText("v = " + this.vel.x, this.pos.x - 10, this.pos.y - 5);
        ctx.fillText("e = " + this.elasticity, this.pos.x - 10, this.pos.y + 5);
    }

    reposition() {
        this.acc = this.acc.unit().mult(this.acceleration);
        this.vel = this.vel.add(this.acc);
        this.vel = this.vel.mult(1 - friction);
        this.pos = this.pos.add(this.vel);
    }
}

//Walls are line segments between two points
class Wall {
    constructor(x1, y1, x2, y2) {
        this.start = new Vector(x1, y1);
        this.end = new Vector(x2, y2);
        WALLZ.push(this);
    }

    drawWall() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    wallUnit() {
        return this.end.subtr(this.start).unit();
    }
}

function acc_Control(b, new_acc_x, new_acc_y) {

    //b.acc.x = acc_x-new_acc_x;

    //b.acc.y = acc_y-new_acc_y;
    b.acc.x = -acl.x;
    b.acc.y = acl.y;

}

function round(number, precision) {
    let factor = 10 ** precision;
    return Math.round(number * factor) / factor;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//returns with the closest point on a line segment to a given point
function closestPointBW(b1, w1) {
    let ballToWallStart = w1.start.subtr(b1.pos);
    if (Vector.dot(w1.wallUnit(), ballToWallStart) > 0) {
        return w1.start;
    }

    let wallEndToBall = b1.pos.subtr(w1.end);
    if (Vector.dot(w1.wallUnit(), wallEndToBall) > 0) {
        return w1.end;
    }

    let closestDist = Vector.dot(w1.wallUnit(), ballToWallStart);
    let closestVect = w1.wallUnit().mult(closestDist);
    return w1.start.subtr(closestVect);
}

function coll_det_bb(b1, b2) {
    if (b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()) {
        return true;
    } else {
        return false;
    }
}

function Horizontal_coll(b) {
    if (b.soundAbilityHorizontal && Math.abs(b.vel.x) > vel_lim) {
        b.soundAbilityHorizontal = false;
        if (b.pos.x > 1 / 3 * right_wall && b.pos.x < 2 / 3 * right_wall) { new Audio('./grzechotka_2.mp3').play(); }
        new Audio('./grzechotka_2.mp3').play();
    }
}

function Vertical_coll(b) {
    if (b.soundAbilityHorizontal && Math.abs(b.vel.y) > vel_lim) {
        b.soundAbilityHorizontal = false;
        if (b.pos.y > 1 / 3 * bottom_wall && b.pos.y < 2 / 3 * bottom_wall) { new Audio('./grzechotka_2.mp3').play(); }
        new Audio('./grzechotka_2.mp3').play();
    }
}

function zderzenie(b) {

    acc_x_test = Math.round(b.vel.y * 100) / 100;

    document.getElementsByClassName("acc_x_test")[0].innerHTML = acc_x_test

    if (b.pos.x < 0 + b.r) {
        b.vel.x = -b.vel.x * coef_restitution;
        b.pos.x += b.r - b.pos.x;
        Horizontal_coll(b)
    }

    if (b.pos.x > right_wall - b.r) {
        b.vel.x = -b.vel.x * coef_restitution
        b.pos.x -= b.pos.x - (right_wall - b.r)
        Horizontal_coll(b)
    }

    if (b.pos.y < 0 + b.r) {
        b.vel.y = -b.vel.y * coef_restitution
        b.pos.y += b.r - b.pos.y
        Vertical_coll(b)

    }
    if (b.pos.y > bottom_wall - b.r) {
        b.vel.y = -b.vel.y * coef_restitution
        b.pos.y -= b.pos.y - (bottom_wall - b.r)
        Vertical_coll(b)

    }
}


function canPlaySound(b) {
    if (b.pos.x > 0 + coef_ability * b.r && b.pos.x < right_wall - coef_ability * b.r) {
        b.soundAbilityHorizontal = true;
    }

    if (b.pos.y > 0 + coef_ability * b.r && b.pos.y < bottom_wall - coef_ability * b.r) {
        b.soundAbilityHorizontal = true;
    }
}


//collision detection between ball and wall
function coll_det_bw(b1, w1) {
    let ballToClosest = closestPointBW(b1, w1).subtr(b1.pos);
    if (ballToClosest.mag() <= b1.r) {
        return true;
    }
}

function pen_res_bb(b1, b2) {
    let dist = b1.pos.subtr(b2.pos);
    let pen_depth = b1.r + b2.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth / (b1.inv_m + b2.inv_m));
    b1.pos = b1.pos.add(pen_res.mult(b1.inv_m));
    b2.pos = b2.pos.add(pen_res.mult(-b2.inv_m));
}

//penetration resolution between ball and wall
function pen_res_bw(b1, w1) {
    let penVect = b1.pos.subtr(closestPointBW(b1, w1));
    b1.pos = b1.pos.add(penVect.unit().mult(b1.r - penVect.mag()));
}

function coll_res_bb(b1, b2) {
    let normal = b1.pos.subtr(b2.pos).unit();
    let relVel = b1.vel.subtr(b2.vel);
    let sepVel = Vector.dot(relVel, normal);
    let new_sepVel = -sepVel * Math.min(b1.elasticity, b2.elasticity);

    let vsep_diff = new_sepVel - sepVel;
    let impulse = vsep_diff / (b1.inv_m + b2.inv_m);
    let impulseVec = normal.mult(impulse);

    b1.vel = b1.vel.add(impulseVec.mult(b1.inv_m));
    b2.vel = b2.vel.add(impulseVec.mult(-b2.inv_m));
}

//collision response between ball and wall
function coll_res_bw(b1, w1) {
    let normal = b1.pos.subtr(closestPointBW(b1, w1)).unit();
    let sepVel = Vector.dot(b1.vel, normal);
    let new_sepVel = -sepVel * b1.elasticity;
    let vsep_diff = sepVel - new_sepVel;
    b1.vel = b1.vel.add(normal.mult(-vsep_diff));
}

function momentum_display() {
    let momentum = Ball1.vel.add(Ball2.vel).mag();
    ctx.fillText("Momentum: " + round(momentum, 4), 500, 330);
}

function mainLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    BALLZ.forEach((b, index) => {
        let new_acc_x = -acl.x;
        let new_acc_y = acl.y;

        b.drawBall();
        if (b.player) {
            acc_Control(b, new_acc_x, new_acc_y);
        }
        //each ball object iterates through each wall object
        zderzenie(BALLZ[index]);

        canPlaySound(b);

        // WALLZ.forEach((w) => {
        //     if(coll_det_bw(BALLZ[index], w)){
        //         pen_res_bw(BALLZ[index], w);
        //         coll_res_bw(BALLZ[index], w);
        //     }
        // })
        for (let i = index + 1; i < BALLZ.length; i++) {
            if (coll_det_bb(BALLZ[index], BALLZ[i])) {
                pen_res_bb(BALLZ[index], BALLZ[i]);
                coll_res_bb(BALLZ[index], BALLZ[i]);
            }
        }
        b.display();
        b.reposition();
    });

    acc_x = -acl.x;
    acc_y = acl.y;
    //drawing each wall on the canvas
    WALLZ.forEach((w) => {
        w.drawWall();
    })

    requestAnimationFrame(mainLoop);
}

//let Wall2 = new Wall(300, 400, 550, 200);

//walls along the canvas edges

//intro if canvas 1138x640
// let Wall1 = new Wall(1000, 350, 1100, 500);
// let Wall2 = new Wall(700, 50, 800, 50);
// let Ball1 = new Ball(-4000, 400, 80, 10);
// let Ball2 = new Ball(960, 585, 35, 2);
// let Ball3 = new Ball(1005, 610, 10, 2);
// let Ball4 = new Ball(1120, 590, 10, 1);
// let Ball45= new Ball(500, 340, 30, 2);
// Ball1.vel.x = 290;


requestAnimationFrame(mainLoop);