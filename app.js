var bogart = require('bogart')
    ,path  = require('path');

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");

var router = bogart.router();
router.get('/', function(req) { 
  var article = { locals: { title: "first blog", body: "blog body" } };

  return viewEngine.respond('index.html', article);
});

router.get('/:name', function(req) {
      return 'hello '+req.params.name;
});

router.get('/posts/new', function(req) {
  return viewEngine.respond('new-post.html', {
    locals: {
      title: 'New Post'
    }
  })
});

var app = bogart.app();
app.use(bogart.batteries({ secret: 'xGljGo7f4g/a1QveU8VRxhZP5Hwi2YWelejBq5h4ynM'})); // A batteries included JSGI stack including streaming request body parsing, session, flash, and much more.
app.use(bogart.middleware.directory(root));
app.use(router); // Our router

app.start(9981);