var bogart = require('bogart')
    ,path  = require('path');

require('dotenv').load();

var viewEngine = bogart.viewEngine('mustache', path.join(bogart.maindir(), 'views'));
var root = require("path").join(__dirname, "public");
var router = bogart.router();
var nano = require('nano')(process.env.DB_HOST);

// possible values of schmipsum sets
var sets = ["shakespeare",
  "jane_austen",
  "lewis_carroll",
  "patents",
  "nixon_tapes",
  "college_essays",
  "mission_statements",
  "beatrix_potter",
  "frankenstein",
  "bible"];

router.get('/', function(req) { 
  var article = { locals: { title: "header title", body: "A body that consists of a lot of things." } };

  return viewEngine.respond('index.html', article);
});

router.get('/posts/new', function(req) {
  //redirect to a random set
  return bogart.redirect('/posts/new/' + sets[Math.floor(Math.random() * sets.length)]);
});

router.get('/posts/new/:name', function(req) {
  var rp = require('request-promise');
  return rp('http://www.schmipsum.com/ipsum/'+req.params.name+'/1000')
    .then(function(response) {
        responseObject = JSON.parse(response);

        return viewEngine.respond('new-post.html', {
        locals: {
          pagetitle: 'add some content based on ' + req.params.name,
          title: responseObject.ipsum.substring(0,responseObject.ipsum.indexOf('\n')),
          body: responseObject.ipsum.substring(responseObject.ipsum.indexOf('\n')),
          allsets: sets
        }
      })
    })
    .catch(console.error);
});

router.post('/posts', function(req) {
  var post = req.params;
  post.type = 'post';

  var articles = nano.db.use('articles');

  var slug = req.params.title.replace(/[^a-zA-Z0-9\s]/g,"");
  slug = slug.toLowerCase();
  slug = slug.trim();
  slug = slug.replace(/\s/g,'-');

  var insert_article = bogart.promisify(articles.insert);

  return insert_article(post, slug).then(function(data) {
    return bogart.redirect('/posts');
  });
});

router.get('/posts', function(req) {
  var articles = nano.db.use('articles');

  var articlelist = bogart.promisify(articles.view);

  return articlelist('article_list', 'articleView').then(function(data) {
    return viewEngine.respond('posts.html', {
      locals: {
        pagetitle: 'all posts',
        postlist: data.rows
      }
    });
  });
});

router.get('/posts/:slug', function(req) {
  var articles = nano.db.use('articles');

  var articlelist = bogart.promisify(articles.get);

  return articlelist(req.params.slug).then(function(data) {
    console.log(data);
    return viewEngine.respond('post.html', {
      locals: {
        title: data.title,
        body: data.body
      }
    });
  });

});

var app = bogart.app();
app.use(bogart.batteries({ secret: 'xGljGo7f4g/a1QveU8VRxhZP5Hwi2YWelejBq5h4ynM'})); // A batteries included JSGI stack including streaming request body parsing, session, flash, and much more.
app.use(bogart.middleware.directory(root));
app.use(router); // Our router

app.start(9981);