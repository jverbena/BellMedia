/*Here we Requiered All Routers */
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Cart = require('../models/cart');


var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/*Here we find the products from DB and we loop */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
    var productBatch = [];
    var batchSize = 3;
   for(var i =0; i < docs.length; i += batchSize ){
      productBatch.push(docs.slice(i, i + batchSize));
    }
    res.render('shop/index', { title: 'BELL MEDIA Shopping Cart', products: productBatch });
 });
});

/*Cart Router*/
router.get('/add-to-cart/:id', function(req, res, next){
 var productId = req.params.id;
 var cart = new Cart(req.session.cart ? req.session.cart : {});

Product.findById(productId, function(err, product){
  if(err){
    return res.redirect('/');
  }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log('ICI ', req.session.cart);
    res.redirect('/')
});

});
router.get('/shopping-cart', function(req, res, next){
    if (!req.session.cart){
      return res.render('shop/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice:cart.totalPrice});
});


/*end of cart*/


router.use('/', notLoggedIn, function(req, res, next){
  next();
})

/*Router  for the signup page with tokens and redirect page*/
router.get('/user/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasError:messages.length > 0 })
});

/*router.post('/user/signup', function(req, res, next){
    res.redirect('/');
})*/

router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
}));

router.get('/user/profile',isLoggedIn, function(req, res, next){
   res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});



router.get('/user/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasError:messages.length > 0 })
});

router.post('/user/signin', passport.authenticate('local.signup',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}));





module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
