var http = require('http');
var mysql = require('mysql');
var path = require('path');
//var favicon = require('static-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');

// function authorize(username, password) {
//     return 'someone' === username & 'password' === password;
// }

var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  // , app = express.createServer(express.basicAuth(authorize))
  , json = require('json')
  // , server = require('http').createServer(app)
;

// app.get('/', function(request, response) {
//     response.send('Authorized!');
// });

console.log('Starting server...')

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
	
	if(tablename) {
		/*присвой в переменную json твой вывод из базы данных*/
		connection.query('SELECT * FROM '+tablename, function(err, rows) {
		if (err) {
			res.send("DB ERROR: "+err);
			/*connection.rollback(function() {
			  throw err;
			});*/
		} else {
			var json = { "draw": 1,
  						 "data": rows };
			//console.log('resp: '+JSON.stringify(json));
			res.send(JSON.stringify(json));
			//callback(null,result[0].hexcode);
		}
		});
    } else {
		console.log('tablename is '+tablename);
	}
});

app.get('/getddlist', function(req, res){
	var q_id = req.query['query'];
	console.log('req.id: '+q_id);
	
	if (q_id == 1) {
		connection.query('SELECT `ID`, `Name` FROM `dropdownlist` GROUP BY `ID`', gettest=function(err, rowsID) {
			if (err) {
				res.send("DB ERROR: "+err);
				/*connection.rollback(function() {
				  throw err;
				});*/
			} else {
				var id_res = JSON.stringify(rowsID);
				console.log(id_res);
				res.send(id_res);
			}
			});
	} else if (q_id == 2) {
		connection.query('SELECT `ID`, `Text` FROM `dropdownlist`', function(err, rows) {
				if (err) {
					res.send("DB ERROR: "+err);
				} else {
					// return rows;
					res.send(JSON.stringify(rows));
				}
			});
	} else {
		res.send('undefine');
	}
	


	
	// if(tablename) {
	// 	/*присвой в переменную json твой вывод из базы данных*/
	// 	connection.query('SELECT * FROM '+tablename, function(err, rows) {
	// 	if (err) {
	// 		res.send("DB ERROR: "+err);
	// 		/*connection.rollback(function() {
	// 		  throw err;
	// 		});*/
	// 	} else {
	// 		var json = { "draw": 1,
 //  						 "data": rows };
	// 		//console.log('resp: '+JSON.stringify(json));
	// 		res.send(JSON.stringify(json));
	// 		//callback(null,result[0].hexcode);
	// 	}
	// 	});
 //    } else {
	// 	console.log('tablename is '+tablename);
	// }
	
// res.end();
});

app.get('/getheader', function(req, res){
	var tablename = req.query['tablename'];
	console.log('req.tablename: '+tablename);
	
	if(tablename) {
		/*присвой в переменную json твой вывод из базы данных*/
		connection.query('SELECT * FROM headers WHERE `Table_name`="'+tablename+'"', function(err, rows) {
		if (err) {
			res.send("DB ERROR: "+err);
			/*connection.rollback(function() {
			  throw err;
			});*/
		} else {
			//var json = { "draw": 1,
  			//			 "data": rows };
			//console.log('resp: '+JSON.stringify(json));
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
	var recDT_RowId=array['DT_RowId'];

	if (recDT_RowId == 'new' ) {
		console.log('jsonArray.DT_RowId '+ recDT_RowId);

		var q = "UPDATE " + tablename + " SET ";
		var q = "INSERT INTO " + tablename + " (";
		
		//console.log('array[1] '+$.parseJSON(JSON.stringify(req.body)));
		var i=0;
		for (var index in array) {
			//console.log('index '+index);
			if ( index != 'DT_RowId' ) {
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
			if ( index != 'DT_RowId' ) {
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
					res.send("ERROR DB: "+err);
				} else {
					var json = JSON.stringify(results);
					
					console.log('insertDT_RowId ', results.insertId);
					console.log(json);
					res.send(JSON.stringify(results));
				}
			});

		console.log('req.body.DT_RowId (updated)', recDT_RowId);
	} else {
		res.send("ERROR Request...");
	}
//res.end();
});


app.post('/update', function(req, res) {
	var tablename = req.query['tablename'];
	console.log('update.tablename: '+tablename);
	var jsonArray = JSON.stringify(req.body);
	console.log('objArray '+jsonArray);
	var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
	var recDT_RowId=array['DT_RowId'];

	console.log('jsonArray.DT_RowId '+ recDT_RowId);

	var q = "UPDATE " + tablename + " SET ";
	
	var i=0;
for (var index in array) {
	//console.log('index '+index);
	if ( index != 'DT_RowId' ) {
		if (i > 0)
			q += ","
		q += " `"+index+"`=\""+array[index]+"\"";
		i++;
	}
}

q += " WHERE `DT_RowId`="+recDT_RowId;
console.log('query: '+q);

	connection.query(q, function (err, results, fields) {
		if (err) {
			res.send("DB ERROR: "+err);
		} else {
			var json = JSON.stringify(results);
			console.log(json);
		}
	});

console.log('req.body.DT_RowId (updated)', recDT_RowId);
res.end();
});

app.post('/delete', function(req, res) {
	var tablename = req.query['tablename'];
	console.log('update.tablename: '+tablename);
	var jsonArray = JSON.stringify(req.body);
	console.log('objArray '+jsonArray);
	var array = typeof jsonArray != 'object' ? JSON.parse(jsonArray) : jsonArray;
	var recDT_RowId=array['DT_RowId'];

	console.log('delete.DT_RowId '+ recDT_RowId);

	if (recDT_RowId) {
	var q = "DELETE FROM " + tablename;

	q += " WHERE `DT_RowId`="+recDT_RowId;
	
	console.log('query: '+q);

	connection.query(q, function (err, results, fields) {
		if (err) {
			res.send("DB ERROR: "+err);
		} else {
			var json = JSON.stringify(results);
			console.log(json);
		}
	});

	console.log('req.body.DT_RowId (deleted)', recDT_RowId);
	}
res.end();

});
app.listen(8080);
// server.listen(8080);
