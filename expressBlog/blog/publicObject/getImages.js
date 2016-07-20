var fs=require('fs');


var getIamges = function(){
	

}
module.exports = getIamges;
getIamges.data = function(callback){
	var data=[];
	fs.readdir("./public/images/upload/", function (err, files) {
        var count = files.length;
        files.forEach(function (filename) {
            //results[filename] = "/public/images/upload/"+filename;
           if (count >= 0) {
                data[count] = {'path':"images/upload/"+filename,'filename':filename};
            }

            count--;
            if(count<=0) {return callback(data);}
        });
    });
}





