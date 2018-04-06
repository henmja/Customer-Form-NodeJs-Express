//require modules...
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs('customerform', ['customers']) //database = customerform, collection = customers
var CustomerId = mongojs.ObjectId;


var app = express();

//start up server on given port...
app.listen(1337, function() {
	console.log("Server started on Port 1337...");
})

//Dependencies...

//Body-Parser....
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//View Engine...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//global vars...
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//path to the public directory, client...
app.use(express.static(path.join(__dirname, 'client')))

//Express Validator Dependency...
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root	= namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam + '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg	  : msg,
			value : value
		};
	}
}));


//render index.ejs on route '/'...
app.get('/', function(req, res){
	db.customers.find(function (err, docs) {
		res.render('index', {
			title: 'Customers',
			customers: docs
		});
	})
	
});

//render index.ejs on post (save button) and add requested customer to mongodb...
app.post('/', function(req, res){
	req.checkBody('firstName', 'First Name missing').notEmpty();
	req.checkBody('lastName', 'Last Name missing').notEmpty();
	req.checkBody('address', 'Address missing').notEmpty();
	req.checkBody('phoneNumber', 'Phone Number missing').notEmpty();
	req.checkBody('email', 'Email missing').notEmpty();

	var errors = req.validationErrors();

	if (errors){
		db.customers.find(function (err, docs) {
		res.render('index', {
		title: 'Customers',
		customers: docs,
		errors: errors
	}); 
	})
	} else {
	var newCustomer = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
		}
		db.customers.insert(newCustomer, function(err, result) {
			res.redirect('/');
		});
	}
});

//delete requested customer (the function is triggered in main.js)...
app.delete('/delete/:id', function(req,res) {
			db.customers.remove({_id: CustomerId(req.params.id)}, function(err, result){
			res.redirect('/');
		});		
	});
