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
   console.log(data);
});

module.exports = router;