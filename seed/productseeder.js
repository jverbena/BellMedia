var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true });


var products = [
    new Product({
    title: 'TV-INT-HP 1',
    description:'The best TV service' ,
    price:10 ,
    imagePath:'https://s0.2mdn.net/3165817/1532708033356/img-banner_TV-INT-HP_en.png' 
  }),
  new Product({
    title: 'Phone Back To School',
    description:'Get a must-have Phone' ,
    price:10 ,
    imagePath:'https://www.bell.ca/Styles/images/img_banner_Back_to_school.jpg' 
 }),
 new Product({
    title: 'Laptop Power Fibe',
    description:'Go Ultra "zultrafast" ' ,
    price:10 ,
    imagePath:'https://www.bell.ca/Styles/RSX/shop/img/img-banner_student_central_en.jpg' 
 }),
 new Product({
    title: 'TV-INT-HP 2',
    description:'The best TV service' ,
    price:10 ,
    imagePath:'https://s0.2mdn.net/3165817/1532708033356/img-banner_TV-INT-HP_en.png' 
  }),
  new Product({
    title: 'Phone Back To School 2',
    description:'Get a must-have Phone' ,
    price:10 ,
    imagePath:'https://www.bell.ca/Styles/images/img_banner_Back_to_school.jpg' 
 }),
 new Product({


    
    title: 'Laptop Power Fibe 2',
    description:'Go Ultra "zultrafast" ' ,
    price:10 ,
    imagePath:'https://www.bell.ca/Styles/RSX/shop/img/img-banner_student_central_en.jpg' 
 }),
 
];

/* To insert Data in MongoDB this can be manually done within mongo*/
/* this file needs to be run with nodejs it does run automatically*/
var counter = 0;
for (var i=0; i < products.length; i++){
    products[i].save(function(err,result){
        counter++;
        if(counter === products.length){
            close();
        } 
    });
}
function close(){
    mongoose.disconnect();
}


/*After Data Has been injeted the productseeder.js mongo db will continue run*/
mongoose.disconnect();
