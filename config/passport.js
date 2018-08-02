var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user.id);
});

/*here we find the user in mongo DB*/ 
passport.deserializeUser(function(id,done){
  User.findById(id, function(err,user){
  done(err, user);
  })
});

/*here is local strategy to find the user*/
passport.use('local.signup', new LocalStrategy({
   usernameField:'email',
   passwordField:'password',
   passReqToCallback:true
   }, function(req, email, password, done){
       req.checkBody('email', 'Invalid email').notEmpty().isEmail();
       req.checkBody('password', 'Invalid password').notEmpty().isLength({min:3});
       var errors = req.validationErrors();
       if(errors){
           var messages = [];
           errors.forEach(function(error){
            messages.push(error.msg);
           });
           return done(null, false, req.flash('error', messages));
       }
       User.findOne({'email':email}, function(err,user){
           if(err){
               return done(err);
           }
           if (!user){
               return done(null, false,{message:'Email Exist already'});
           }

           var newUser = new User();
           newUser.email = email;
           newUser.password = newUser.encryptPassword(password);
           newUser.save(function(err, result){
               if(err){
                   return done(err);
               }
               return done(null, newUser);
           });
       });
}));


passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
         messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email':email}, function(err,user){
        if(err){
            return done(err);
        }
        if (!user){
            return done(null, false,{message:'No user Found.'});
        }
        if(!user.validPassword(password)){
            return done(null, false,{message:'Wrong password'});
        }
        return done(null, user);
        /*var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });*/
    });
}));