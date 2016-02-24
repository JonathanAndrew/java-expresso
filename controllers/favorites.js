var express = require('express');
var router = express.Router();
var db = require('../models');

// current : /favorites

router.get("/", function(req,res){
	db.user.findById(req.session.user.id).then(function(user){
		user.getFavorites().then(function(favorites){
			res.render("favorites", {favorites:favorites});
		});	
	});
});

router.post("/", function(req,res){
	console.log(req.body);
	db.user.findById(req.session.user.id).then(function(user){
		db.favorite.findOrCreate({
			where : {
				name : req.body.name,
				address : req.body.address,
				phone_number : req.body.phone_number,
				is_closed : req.body.is_closed,
				yelp_url : req.body.url,
				image_url : req.body.image_url,
				rating_img_url_large : req.body.rating_img_url_large,
				lng : req.body.lng,
				lat : req.body.lat
			}
		}).spread(function(favorite, created){
			db.usersFavorites.findOrCreate({
				where : {
					userId : user.id,
					favoriteId : favorite.id
				}
			}).spread(function(userFavorite, created){
				if (created){
					res.redirect("/favorites");
				} else {
					res.send("This is already a favorite");
				}
			}).catch(function(err){
				res.send(err);
			});
		}).catch(function(err){
			res.send(err);
		});
	});
});

module.exports = router;