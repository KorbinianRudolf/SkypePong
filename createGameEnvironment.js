var CONSTANTS = new Constants();
var gameCanvas = document.getElementById('gameboard');

var clicked1 = [0,0,0,0,0,0];
var clicked2 = [0,0,0,0,0,0];
var clicked3 = [0,0,0,0,0,0];
var clicked = null;
var intervalHolder = null;
var intervalHolder2 = null;
var url = window.location.protocol + '//' + window.location.host + '/SkypePong/status.json';
console.log(url);
var fieldWith = gameCanvas.width/3;


function updateDisplay() {
    fetch(url).then((res) => {
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        clearInterval(intervalHolder2);
        var j = res.json();
        j.then((data) => {
           clicked = data;
           console.log(clicked);
           clicked1 = clicked["cl1"];
           clicked2 = clicked["cl2"];
           clicked3 = clicked["cl3"];
           console.log(clicked1);
           intervalHolder = setInterval(updateDisplay, 2000);
        });
    })
}

function updateDatabase() {
    const data = {"cl1": clicked1, "cl2": clicked2, "cl3":clicked3};

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }).then((res) => res.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        })
}


gameCanvas.addEventListener('click', function(event) {
   var x = event.pageX;
   var y = event.pageY;
   var start = -1;
   var cl = [];

   if(x < fieldWith) {
       start = 0;
       cl = clicked1;
       console.log("1");
   } else if (x < fieldWith*2) {
       start = fieldWith;
       cl = clicked2;
       console.log("2")
   } else if (x < fieldWith*3) {
       start = fieldWith*2;
       cl = clicked3;
       console.log("3");
   } else {
       alert("Motherfucker what?");
       return;
   }


   var dis =(fieldWith/4);
   var eps = CONSTANTS.CUP_RADIUS;
   if((Math.abs((start + (fieldWith/4)) - x) <= eps ) && (Math.abs(15 - y) <= eps)){
        cl[0] = cl[0] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWith/2)) - x) <= eps) && (Math.abs(15 - y) <= eps)) {
       cl[1] = cl[1] === 0? 1 : 0;
   } else if((Math.abs((start + ((fieldWith/4)*3)) - x) <= eps) && (Math.abs(15 - y) <= eps)) {
       cl[2] = cl[2] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWith/3)) - x ) <= eps) && (Math.abs((15+dis) - y) <= eps)) {
       cl[3] = cl[3] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWith/3)*2) - x ) <= eps) && (Math.abs((15+dis) - y) <= eps)) {
       cl[4] = cl[4] === 0? 1 : 0;
   } else if((Math.abs((start + (fieldWith/2)) - x ) <= eps) && (Math.abs((15+2*dis) - y) <= eps)) {
       cl[5] = cl[5] === 0? 1 : 0;
   }

   console.log(clicked1);
   console.log(clicked2);
   console.log(clicked3);

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
    var dis = (width/4);

    var colors = [];

    if(!cl){
        return;
    }

    cl.forEach(el => {
       if(el == 0) {
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
    var context = gameCanvas.getContext('2d');
    context.clearRect(0,0,gameCanvas.width, gameCanvas.height);

    drawGameField(context, 0, fieldWith, clicked1, "Roman");
    drawGameField(context, fieldWith, fieldWith, clicked2, "Rinz");
    drawGameField(context, fieldWith*2, fieldWith, clicked3, "Korbinian");


}

if(gameCanvas) {
    var context = gameCanvas.getContext('2d');

    if(context) {
        intervalHolder2 = setInterval(updateDisplay, 5000);
        intervalHolder = setInterval(mainLoop, 15);

    }

} else {
    console.error('Could not load gameboard canvas.');
}