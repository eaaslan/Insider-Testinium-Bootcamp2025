// Kullanıcı bilgileri
const userName = prompt("Enter your name: ")
const age = prompt("Enter your age: ")
const job = prompt("Enter your job: ")
const user = { name: userName, age: age, job: job }
console.log("User information: ", user)


let cart = []

function addToCart() {
    const productName = prompt("Enter the product name you want to add to the cart: ")
    if (productName === "q") return false 
    
    const price = Number(prompt("The product price: "))
    cart.push({ product: productName, price: price })
    console.log(`${productName} has added to the cart. Price: ${price} TL`)
    return true
}

function removeFromCart() {
    const productName = prompt("Enter the item name you want to remove from the cart: ")
    if (productName === "q") return false
    //cart = cart.filter(item => item.product !== productName)
    const index=cart.findIndex(item=>item.product ===productName)
    if(index>-1){
        cart.splice(index,1)
        console.log(`${productName} Product removed from the cart.`)
    }else{
        console.log(`${productName} not found in the cart.`)
    }
   
    return true
}

function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0)
    return total
}

function showCart() {
    console.log("Your cart:", cart)
    console.log("Total price:", calculateTotal(), "TL")
}

while (true) {
    const choice = prompt("Choose action you want to do (1: Add, 2: Remove, q: Exit):")
    
    if (choice === "q") {
        break
    } else if (choice === "1") {
        if (!addToCart()) break
        showCart()
    } else if (choice === "2") {
        if (!removeFromCart()) break
        showCart()
    }
}

showCart()

