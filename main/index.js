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

router.post('/', (req, res) => {
   const data = req.body;
   const jsonFile = fs.readFileSync(__dirname + '/status.json');
   const status = JSON.parse(jsonFile);

   const res1 = check(data["cl1"], status["cl1"]);
   const res2 = check(data["cl2"], status["cl2"]);
   const res3 = check(data["cl3"], status["cl3"]);
   const newStatus = JSON.stringify({cl1: res1, cl2: res2, cl3: res3});

   fs.writeFileSync(__dirname + '/status.json', newStatus);
   res.json(newStatus);
});

router.post('/reset', (req, res) => {
    const newStatus = JSON.stringify({cl1: [0,0,0,0,0,0], cl2: [0,0,0,0,0,0], cl3: [0,0,0,0,0,0]});

    fs.writeFileSync(__dirname + '/status.json', newStatus);
    res.json(newStatus);
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