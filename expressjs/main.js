var newTemps = document.getElementById("newTemps");
var tmpl1 = "<p>val is : <%= vals %></p>";

setInterval(function(){
	var val = document.getElementById("new-tem-val").value || null;
	console.log(val)
	newTemps.innerHTML = ejs.render(tmpl1,{vals:val});
},2000)