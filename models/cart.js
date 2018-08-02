/*it Gets the old cart if is created if not will be an empty js object */
module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
// add new item to the cart
    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item:item, qty:0, price:0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }


    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
        arr.push(this.items[id]);
        }
    return arr;
    };
};
