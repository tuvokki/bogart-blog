var bogart = require('bogart')
    ,path  = require('path');

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");
var router = bogart.router();
var nano = require('nano')('https://couchdb-f0fd27.smileupps.com');

router.get('/', function(req) { 
  var article = { locals: { title: "header title", body: "A body that consists of a lot of things." } };

  return viewEngine.respond('index.html', article);
});

router.get('/posts/new', function(req) {
  return viewEngine.respond('new-post.html', {
    locals: {
      title: 'New Post'
    }
  })
});

router.post('/posts', function(req) {
  var post = req.params;
  post.type = 'post';

  var articles = nano.db.use('articles');

  var insert_article = bogart.promisify(articles.insert);

  return insert_article(post).then(function(data) {
    console.log('you have inserted the body: ', data)
    return bogart.redirect('/posts');
  });
});

router.get('/posts', function(req) {
  var articles = nano.db.use('articles');

  var readlist = bogart.promisify(articles.list);

  return readlist().then(function(data) {
    console.log(data);
    return viewEngine.respond('posts.html', data)
  });
  console.log('render');
});

var app = bogart.app();
app.use(bogart.batteries({ secret: 'xGljGo7f4g/a1QveU8VRxhZP5Hwi2YWelejBq5h4ynM'})); // A batteries included JSGI stack including streaming request body parsing, session, flash, and much more.
app.use(bogart.middleware.directory(root));
app.use(router); // Our router

app.start(9981);