let cart = []
let whatsapp = ""

fetch("data.json")
.then(res=>res.json())
.then(data=>{

document.getElementById("name").innerText=data.name
document.getElementById("tagline").innerText=data.tagline

whatsapp=data.whatsapp

let menuHTML=""

data.menu.forEach(food=>{

menuHTML+=`

<div class="card">

<img src="${food.image}">

<h3>${food.item}</h3>

<p>₹${food.price}</p>

<button onclick="addToCart('${food.item}',${food.price})">Add</button>

</div>

`

})

document.getElementById("menu").innerHTML=menuHTML

})

function addToCart(item,price){

cart.push({item,price})

alert(item+" added")

}

function orderWhatsApp(){

let message="Food Order:%0A"

cart.forEach(i=>{

message+=i.item+" - ₹"+i.price+"%0A"

})

window.open(`https://wa.me/${whatsapp}?text=${message}`)

}

function bookRoom(){

let msg="I want to book AC Room at Wedson Hotel & Resort"

window.open(`https://wa.me/${whatsapp}?text=${msg}`)

}
