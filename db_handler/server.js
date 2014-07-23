var http = require('http');
var mysql = require('mysql');
var path = require('path');
//var favicon = require('static-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , json = require('json')
  , server = require('http').createServer(app)
;

var router = express.Router()


var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  database: 'my_db',
  user : 'test',
  password : 'test111'
});

app.use(express.static(__dirname));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getdb', function(req, res){
	var tablename = req.query['tablename'];
	console.log('req.tablename: '+tablename);
	var json = {};
	if(tablename) {
		/*присвой в переменную json твой вывод из базы данных*/
		connection.query('SELECT * FROM '+tablename, function(err, rows) {
		if (err) {
			res.send("DB ERROR: "+err);
			/*connection.rollback(function() {
			  throw err;
			});*/
		} else {
			res.send(JSON.stringify(rows));
			//callback(null,result[0].hexcode);
		}
		});
    } else {
		console.log('tablename is '+tablename);
	}
});

app.post('/create', function(req, res) {
	var tablename = req.query['tablename'];
	console.log('create.tablename: '+tablename);
	var jsonArray = JSON.stringify(req.body);
	console.log('objArray '+jsonArray);
	var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
	var recID=array['ID'];

	if (recID == 'new' ) {
		console.log('jsonArray.ID '+ recID);

		var q = "UPDATE " + tablename + " SET ";
		var q = "INSERT INTO " + tablename + " (";
		
		//console.log('array[1] '+$.parseJSON(JSON.stringify(req.body)));
		var i=0;
		for (var index in array) {
			//console.log('index '+index);
			if ( index != 'ID' ) {
				if (i > 0)
					q += ","
				q += " `"+index+"`";
			}
			i++;
		}
		q += ") VALUES(";
		i=0;//iterator
		for (var index in array) {
			//console.log('index '+index);
			if ( index != 'ID' ) {
				if (i > 0)
					q += ","
				q += "\""+array[index]+"\"";
				
			}
			i++;
		}

		q += ")";
		console.log('query: '+q);

		connection.query(q, function (err, results, fields) {
				if (err) {
					res.send("DB ERROR: "+err);
				} else {
					//var json = JSON.stringify(results);
					
					console.log('insertId ', results.insertId);
					console.log(json);
					res.send(JSON.stringify(results));
				}
			});

		console.log('req.body.id (updated)', recID);
	} else {
		res.send("Request ERROR...");
	}
//res.end();
});


app.post('/update', function(req, res) {
	var tablename = req.query['tablename'];
	console.log('update.tablename: '+tablename);
	var jsonArray = JSON.stringify(req.body);
	console.log('objArray '+jsonArray);
	var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
	var recID=array['ID'];

	console.log('jsonArray.ID '+ recID);

	var q = "UPDATE " + tablename + " SET ";
	
for (var index in array) {
	//console.log('index '+index);
	if ( index != 'ID' ) {
		if (index != 'CC')
			q += ","
		q += " `"+index+"`=\""+array[index]+"\"";
		
	}
}

q += " WHERE `ID`="+recID;
console.log('query: '+q);

	connection.query(q, function (err, results, fields) {
		if (err) {
			res.send("DB ERROR: "+err);
		} else {
			var json = JSON.stringify(results);
			console.log(json);
		}
	});

console.log('req.body.id (updated)', recID);
res.end();
});

app.post('/delete', function(req, res) {
	var tablename = req.query['tablename'];
	console.log('update.tablename: '+tablename);
	var jsonArray = JSON.stringify(req.body);
	console.log('objArray '+jsonArray);
	var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
	var recID=array['ID'];

	console.log('delete.ID '+ recID);

	if (recID) {
	var q = "DELETE FROM " + tablename;

	q += " WHERE `ID`="+recID;
	
	console.log('query: '+q);
/*
	connection.query(q, function (err, results, fields) {
		if (err) {
			res.send("DB ERROR: "+err);
		} else {
			var json = JSON.stringify(results);
			console.log(json);
		}
	});*/

	console.log('req.body.id (deleted)', recID);
	}
res.end();

});

server.listen(8080);
