var express = require('express');
var router = express.Router();
var picture  = require('../publicObject/getImages.js');
router.get('/picture', function (req, res) {

	picture.data(function(data){
		console.log(data)
		 res.render('pictrue', {
	      title: 'myLove',
	      user: req.session.user,
	      picture:data,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
	    });
	})
   
});
module.exports = router;