
var express = require('express'),
    http = require('http'),
    flash = require('connect-flash'),
    path = require('path'),
    RedisStore = require('connect-redis')(express);

var environment = process.env.NODE_ENV || "development";
var config = require('./config/' + environment);

var routes = {
    index: require('./routes/index')
};

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 
    app.use(express.logger('dev'));
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());

    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookie_secret));
    app.use(express.session({
        store: new RedisStore({prefix: "session:"}),
        secret: config.session_secret
    }));
    app.use(flash());

    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index.index);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
