var bogart = require('bogart')
    ,path  = require('path');

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));

var router = bogart.router();
router.get('/', function(req) { 
  return viewEngine.respond('index.html', { locals: { description: 'This is content' } });
});

router.get('/:name', function(req) {
      return 'hello '+req.params.name;
});

var app = bogart.app();
app.use(bogart.batteries({ secret: 'xGljGo7f4g/a1QveU8VRxhZP5Hwi2YWelejBq5h4ynM'})); // A batteries included JSGI stack including streaming request body parsing, session, flash, and much more.
app.use(router); // Our router

app.start(9981);