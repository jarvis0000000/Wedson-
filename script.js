let cart=[]

function addToCart(name,price){

cart.push({name,price})

document.getElementById("cartCount").innerText=cart.length

alert(name+" added to cart")

}

function orderNow(){

if(cart.length===0){
alert("Cart is empty")
return
}

let msg="Food Order:%0A"

cart.forEach(item=>{
msg+=item.name+" - ₹"+item.price+"%0A"
})

window.open("https://wa.me/919876543210?text="+msg)

}
