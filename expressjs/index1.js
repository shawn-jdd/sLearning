var express =require('express');
var app = express();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
app.get('/plain-text',function(req,res){
	res.status(200).send('hello adb');
})
var questionsJson = [
	{	id:1,
		tilte:"abd",
		asker:"you",
		course:"nodejs-express",
		"last-reply":Date.now(),
		state:1,
		reply:1
	},{
		id:2,
		tilte:"fdsfsdfs",
		asker:"yofdsu",
		course:"nodejs-express2",
		"last-reply":Date.now(),
		state:2,
		reply:1
	}
	]
app.get('/app',function(req,res){
	//res.send('hello word');
	res.status(200);
	res.json({
		python:20,
		nodejs:1,
		others:10
	});

})

app.get("/questions",function(req,res){
	res.status(200);
	res.json(questionsJson)
})
app.get('/questions/all',function(req,res){
	res.status(200);
	res.json(questionsJson)
})
app.get('/questions/resolved',function(req,res){
	res.status(200);
	res.json(questionsJson.filter(function(q){
		return q && q.state === 1;
	}))
})
app.get('/questions/unresolved',function(req,res){
	res.status(200);
	res.json(questionsJson.filter(function(q){
		return q && q.state === 2;
	}))
})
app.listen(3000, function () {
  console.log('shawn app listening on port 3000!');
});