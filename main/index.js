const Router = require('express').Router;
const fs = require('fs');

const router = Router();

router.get('/', (req,res) => {
    fs.readFile('./main/index.html', null, (error, data) => {
        if(error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
        }
        res.end();
    });
});

router.get('/constants.js', (req, res) => {
    res.type('.js');
    res.sendFile(__dirname + '/constants.js');
} );

router.get('/createGameEnvironment.js', (req, res) => {
    res.type('.js');
    res.sendFile(__dirname + '/createGameEnvironment.js');
} );

router.get('style.css', (req, res) => {
    res.type('.css');
    res.sendFile(__dirname + '/style.css');
});

router.post('/', (req, res) => {
   const data = req.body;
   const jsonFile = fs.readFileSync(__dirname + '/status.json');
   const status = JSON.parse(jsonFile);
   let player = status["player"];

   let newStatus = {};
   newStatus["player"] = player;

   for(let i = 0; i < player; i++) {
       let cur = "cl" + (i+1).toString();
        newStatus[cur] = check(data[cur], status[cur]);
        console.log("check" + newStatus[cur]);
   }

   const result = JSON.stringify(newStatus);
   fs.writeFileSync(__dirname + '/status.json', result);
   res.json(result);
});

router.post('/reset', (req, res) => {
    const jsonFile = fs.readFileSync(__dirname + '/status.json');
    console.log(jsonFile);
    const status = JSON.parse(jsonFile);
    let player = status["player"];
    let newStatus = {};
    newStatus["player"] =  player;

    for(let i = 0; i < player; i++) {
        let cur = "cl" + (i+1).toString();
        newStatus[cur] = [0,0,0,0,0,0];
    }

    let str = JSON.stringify(newStatus);


    fs.writeFileSync(__dirname + '/status.json', str);
    res.json(str);
});

router.post('/init', (req, res) => {
    const player = req.body["player"];
    let newStatus = {};
    newStatus["player"] = player;
    for(let i = 0; i < player; i++) {
        newStatus["cl" + (i+1).toString()] = [0,0,0,0,0,0];
    }

    let str = JSON.stringify(newStatus);
    fs.writeFileSync(__dirname + '/status.json', str);
    res.json(str);

});

router.get('/status', (req,res) => {
    const jsonFile = fs.readFileSync(__dirname + '/status.json');
    const status = JSON.parse(jsonFile);

    res.json(status);
});

function check(clOld, clNew) {
    res = [];
    for(i = 0; i < clOld.length; i++) {
        if(clOld[i] === 1 || clNew[i] === 1) {
            res.push(1);
        } else {
            res.push(0);
        }
    }
    return res;
}

module.exports = router;