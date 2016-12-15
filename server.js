var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    passport = require('passport'),
    GithubStrategy = require('passport-github').Strategy,
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./public/views');
app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public/views')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GithubStrategy({
    clientID: "b5c4c9e5056ab3d54a69",
    clientSecret: "f915eb5b6fdbf444e6cf084dc8fb920bf8967000",
    callbackURL: "http://104.199.163.36:8080/auth/callback"
    }, function(accessToken, refreshToken, profile, done) {
         done(null, profile);
       }
    )
);
app.all('/auth',
    passport.authenticate("github", {scope: "email"}));

app.get("/auth/callback",
    passport.authenticate("github", {
             successRedirect: '/',
             failureRedirect: '/error'
   }));

app.get("/error",
   function (req, res) {
     res.send("Authorization Failure.");
  });

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : '104.199.183.153',
        user     : 'root',
        password : 'root',
        database : 'imoney',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.get('/',function(req,res){
    res.send('Welcome');
});


//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var analytics = router.route('/listCostPerMonth');
analytics.get(function(req, res, next) {
    req.getConnection(function(err,conn){
        var year = "2016";
        // /listCostPerMonth/?year=2016
        var yearPair = req.url.split("?");
        if (yearPair != null && yearPair[1] != null && yearPair[1].trim() != "") {
          var yearValues = yearPair[1].trim().split("=");
          if (yearValues != null && yearValues[1] != null && yearValues[1].trim() != "") year = yearValues[1];
        }

        if (err) return next("Cannot Connect");
        var query = conn.query("SELECT SUM(cost) as costpermonth, MONTH(date) as month FROM t_costRecord WHERE YEAR(date) = " + year + " GROUP BY MONTH(date)",function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            var monthlyCost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < rows.length; i++) {
              monthlyCost[rows[i].month-1] = rows[i].costpermonth;
            }
            console.log("Getting " + year + ": " + monthlyCost.join());
            res.status(200).send(monthlyCost.join());
         });
    });
});

var curut = router.route('/costRecord');


//show the CRUD interface | GET
curut.get(function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM t_costRecord',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('costRecord',{title:"cost record",data:rows});

         });

    });

});
//post data to DB | POST
curut.post(function(req,res,next){

    //validation
    req.assert('date','Date is required').notEmpty();
    req.assert('type','Type is required').notEmpty();
    req.assert('cost','Cost is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        date:req.body.date,
        type:req.body.type,
        cost:req.body.cost
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO t_costRecord set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/costRecord/:record_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/costRecord/:record_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
curut2.get(function(req,res,next){

    var record_id = req.params.record_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM t_costRecord WHERE record_id = ? ",[record_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("Record Not found");

            res.render('edit',{title:"Edit Record",data:rows});
        });

    });
});

//update data
curut2.put(function(req,res,next){
    var record_id = req.params.record_id;

    //validation
    req.assert('date','Date is required').notEmpty();
    req.assert('type','Type is required').notEmpty();
    req.assert('cost','Cost is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        date:req.body.date,
        type:req.body.type,
        cost:req.body.cost
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE t_costRecord set ? WHERE record_id = ? ",[data,record_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });
    });
});

//delete data
curut2.delete(function(req,res,next){

    var record_id = req.params.record_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM t_costRecord  WHERE record_id = ? ",[record_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(8080,function(){

   console.log("Listening to port %s",server.address().port);

});
