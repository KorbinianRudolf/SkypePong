let CONSTANTS = new Constants();
let gameCanvas = document.getElementById('gameboard');

let player = 3;
let names = ["Roman", "Rinz", "Korbinian"];
let fieldWidth = gameCanvas.width/player;
let clicked = [];

for(let i = 0; i < player; i++) {
    clicked.push([0,0,0,0,0,0]);
}

let clicked1 = clicked[0];
let clicked2 = clicked[1];
let clicked3 = clicked[2];

let intervalHolder = null;
let intervalHolder2 = null;
let url = window.location.protocol + '//' + window.location.host + '/status';
console.log(url);



function updateDisplay() {
    fetch(url).then((res) => {
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        //clearInterval(intervalHolder2);
        let j = res.json();
        j.then((data) => {
           clicked = data;
           console.log(clicked);
           clicked1 = clicked["cl1"];
           clicked2 = clicked["cl2"];
           clicked3 = clicked["cl3"];
           console.log(clicked1);
           //intervalHolder = setInterval(updateDisplay, 2000);
        });
    })
}

function updateDatabase() {
    const data = {"cl1": clicked1, "cl2": clicked2, "cl3":clicked3};

    fetch(window.location.protocol + '//' + window.location.host + '/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        })
}

function reset() {

    clicked1 = [0,0,0,0,0,0];
    clicked2 = [0,0,0,0,0,0];
    clicked3 = [0,0,0,0,0,0];

    fetch(window.location.protocol + '//' + window.location.host + '/reset', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: "reset command"}),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        })
}


gameCanvas.addEventListener('click', function(event) {
   let x = event.pageX;
   let y = event.pageY;
   let start = -1;
   let cl = [];

   if(x < fieldWidth) {
       start = 0;
       cl = clicked1;
       console.log("1");
   } else if (x < fieldWidth*2) {
       start = fieldWidth;
       cl = clicked2;
       console.log("2")
   } else if (x < fieldWidth*3) {
       start = fieldWidth*2;
       cl = clicked3;
       console.log("3");
   } else {
       alert("Motherfucker what?");
       return;
   }


   let dis =(fieldWidth/4);
   let eps = CONSTANTS.CUP_RADIUS;
   if((Math.abs((start + (fieldWidth/4)) - x) <= eps ) && (Math.abs(15 - y) <= eps)){
        cl[0] = cl[0] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWidth/2)) - x) <= eps) && (Math.abs(15 - y) <= eps)) {
       cl[1] = cl[1] === 0? 1 : 0;
   } else if((Math.abs((start + ((fieldWidth/4)*3)) - x) <= eps) && (Math.abs(15 - y) <= eps)) {
       cl[2] = cl[2] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWidth/3)) - x ) <= eps) && (Math.abs((15+dis) - y) <= eps)) {
       cl[3] = cl[3] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWidth/3)*2) - x ) <= eps) && (Math.abs((15+dis) - y) <= eps)) {
       cl[4] = cl[4] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWidth/2)) - x ) <= eps) && (Math.abs((15+2*dis) - y) <= eps)) {
       cl[5] = cl[5] === 0? 1 : 0;
   }

   updateDatabase();
   updateDisplay();

});

function drawCup(ctx, x, y, color) {
    if(ctx) {

        ctx.beginPath();
        ctx.arc(x,y, CONSTANTS.CUP_RADIUS, 0 ,2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

    }
}

function drawGameField(ctx, start, width, cl, name) {
    let dis = (width/4);        //4, because there are three cups in the first row, so the cups divide the field in 4 parts

    let colors = [];

    if(!cl){
        return;
    }

    cl.forEach(el => {
       if(el === 0) {
           colors.push('#ad0211');
       } else {
           colors.push('#FFF');
       }
    });


    drawCup(ctx, start + (width/4), 15, colors[0]);
    drawCup(ctx, start + (width/2), 15, colors[1]);
    drawCup(ctx, start + ((width/4)*3), 15, colors[2]);

    drawCup(ctx, start + (width/3), 15 + dis, colors[3]);
    drawCup(ctx, start + (width/3)*2, 15 + dis, colors[4]);

    drawCup(ctx, start + (width/2), 15+2*dis, colors[5]);

    ctx.font = "30px Arial";
    ctx.fillStyle = '#ad0211';
    ctx.fillText(name, (start + width/2) - (ctx.measureText(name).width/2), 15+3*dis);

}

function mainLoop() {
    let context = gameCanvas.getContext('2d');
    context.clearRect(0,0,gameCanvas.width, gameCanvas.height);

    for(let i = 0; i < player; i++) {
        drawGameField(context, i*fieldWidth, fieldWidth, clicked[i], names[i]);
    }

}

if(gameCanvas) {
    let context = gameCanvas.getContext('2d');

    if(context) {
        updateDisplay();
        intervalHolder2 = setInterval(updateDisplay, 5000);
        intervalHolder = setInterval(mainLoop, 15);

    }

} else {
    console.error('Could not load gameboard canvas.');
}