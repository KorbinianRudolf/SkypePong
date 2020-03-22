let CONSTANTS = new Constants();
let gameCanvas = document.getElementById('gameboard');
document.getElementById("reset").onclick = reset;


let player = 4;

let names = [];

let fieldWidth;



let intervalHolder = null;
let intervalHolder2 = null;
let url = window.location.protocol + '//' + window.location.host;
console.log(url);


function init() {
    let data = {};
    data["player"] = player;
    fetch(url + '/init', {
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


function updateDisplay() {
    fetch(url + '/status').then((res) => {
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        //clearInterval(intervalHolder2);
        let j = res.json();
        j.then((data) => {
           clicked = data;
           console.log(clicked);
           for(let i = 0; i < player; i++) {
               clicked[i] = clicked["cl" + (i+1).toString()];
           }

           player = data["player"];
           console.log(clicked[0]);

        });
    })
}

function updateDatabase() {
    const data = {};
    for(let i = 0; i < player; i++) {
        data["cl" + (i+1).toString()] = clicked[i];
    }

    fetch(url + '/', {
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

    fetch(url + '/reset').then((res) => {
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        let j = res.json();
        j.then((data) => {
            console.log("Reset: " + JSON.stringify(data));
        });
    });

    updateDisplay();
}

gameCanvas.addEventListener('click', function(event) {
   let x = event.pageX;
   let y = event.pageY;
   let start = -1;
   let cl = [];

   for(let i = 0; i < player; i++) {
       if(x < (i+1)*fieldWidth) {
           start = i * fieldWidth;
           cl = clicked[i];
           console.log((i+1));
           break;
       }
   }

   if(x > fieldWidth*player) {
       alert("Sorry ,what?");
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

        fieldWidth = gameCanvas.width/player;
        for(let i = 0; i < player; i++) {
            names[i] = "player" + (i+1).toString();
        }
        let clicked = [];
        for(let i = 0; i < player; i++) {
            clicked.push([0,0,0,0,0,0]);
        }

        intervalHolder2 = setInterval(updateDisplay, 5000);
        intervalHolder = setInterval(mainLoop, 15);

    }

} else {
    console.error('Could not load gameboard canvas.');
}