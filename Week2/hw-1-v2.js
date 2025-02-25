
const prompt = require('prompt');

prompt.start();

const cart=[]
const userInfo = [
    {
        name: 'name',
        description: 'Enter your name'
    },
    {
        name: 'age',
        description: 'Enter your age'
    },
    {
        name: 'job',
        description: 'Enter your job'
    }
];

const menuChoice = [
    {
        name:'choice',
        description:'Choose action (1: Add, 2: Remove, q: Quit)'
    }

]
const addProduct = [
    {
        name: 'itemName',
        description: 'Enter name of the item'
    },
    {
        name: 'price',
        description: 'Enter price of the item'
    },
 
];
const removeProduct=[
    {
        name:'itemName',
        description: 'Enter name of the item to remove'
    }
]



const shop = async ()=>{

    while(true){
        const result = await prompt.get(menuChoice);
      const choice=  result.choice.toLowerCase()
        switch(choice){

            case 'q':
                console.log('Ready to check-out')
                showCart();
                return;

            case '1':
                const item = await prompt.get(addProduct)
                cart.push({product: item.itemName, price: Number(item.price)});
                showCart()
                break;

            case '2':
                const itemToRemove = await prompt.get(removeProduct);
                const index= cart.findIndex(item => item.product===itemToRemove.itemName)
                if(index>-1){
                    cart.splice(index,1);
                    console.log(`${itemToRemove.itemName} removed from the cart.`);
                }else{
                    console.log(`${itemToRemove.itemName} not found in the cart.`)
                }
                showCart()
                break;

            default:
                console.log("Invalid choice. Please try again.");
                break;
        }
            
    }

}

const showCart = ()=>{
    console.log("Current cart")
    console.log(cart)
  //cart = cart.filter(item => item.product !== productName)
    const totalPrice= cart.reduce((acc,cur)=>acc+=cur.price,0)
    console.log(`Total price: $${totalPrice}`)
}


prompt.get(userInfo, async function(err, result) {
    if (err) { return console.error(err); }
    
    const user = {
        name: result.name,
        age: result.age,
        job: result.job
    };
    console.log('User information:', user);
    await shop()
});