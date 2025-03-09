const productsArr = [];
const cartArr = [];
let total = 0;

$(() => {
  const loadPost = () => {
    $.getJSON("https://fakestoreapi.com/products").done((products) => {
      productsArr.push(...products);
      console.log(productsArr);

      const html = products
        .map((product) => {
          return `
          <div class="product-box" data-id="${product.id}">
            <div class="card-img">
              <img src="${product.image}" alt="">
            </div>
            <div class="card-body">
              <h2 class="card-title">${product.title}</h2>
                <span class="card-price">$${product.price}</span>
                <i class='bx bxs-shopping-bag add-cart' ></i>
            </div>      
          </div>
          `;
        })
        .join("");
      $(".shop-content").append(html);
    });
  };

  addProductToCart = (product) => {
    if (cartArr[product.id] > 0) {
      console.log("im here");
      const quantity = $(`.cart-box[data-id="${product.id}"] .cart-quantity`);
      quantity.val(parseInt(quantity.val()) + 1);
      cartArr[product.id]++;
    } else {
      cartArr[product.id] = 1;
      $(".cart-content").prepend(`
        <div class="cart-box" data-id="${product.id}">
        <div class="cart-img">
          <img src="${product.image}" alt="">
        </div>
          <div class="detail-box">
            <h3 class="cart-product-title">${product.title}</h3>
            <div class="cart-price">$${product.price}</div>
            <input type="number" value="1" class="cart-quantity" />
          </div>
        <i class="bx bx-trash cart-remove"></i>
        </div>
      `);
    }
    total += product.price;
    $(".total-price").text(`Total: $${total}`);
  };
  loadPost();

  $("#cart-icon").click(function (e) {
    e.stopPropagation(); // to prevent overlaps with document click event
    $(".cart").toggleClass("active");
  });

  $("#close-cart").click(function (e) {
    $(".cart").removeClass("active");
  });
  $(document).click(function () {
    $(".cart").removeClass("active");
  });
  $(".cart").click(function (e) {
    e.stopPropagation(); // to prevent close cart on click
  });

  $(".shop-content").on("click", ".add-cart", function () {
    const productID = $(this).closest(".product-box").data("id");
    const product = productsArr[productID - 1];
    addProductToCart(product);
  });

  const removeProductFromCard = (productID) => {
    total -= productsArr[productID - 1].price * cartArr[productID];
    $(`.cart-box[data-id="${productID}"]`).remove();
    delete cartArr[productID];
    $(".total-price").text(`Total: $${total.toFixed(2)}`);
  };

  $(".cart-content").on("click", ".cart-remove", function () {
    const productID = $(this).closest(".cart-box").data("id");
    removeProductFromCard(productID);
    // total -= productsArr[productID - 1].price * cartArr[productID];
    // $(this).closest(".cart-box").remove();
    // delete cartArr[productID];
    // $(".total-price").text(`Total: $${total}`);
  });

  $(".cart-content").on("change", ".cart-quantity", function () {
    const productID = $(this).closest(".cart-box").data("id");
    const product = productsArr[productID - 1];
    const quantity = $(this).val();

    console.log(`Product ID: ${productID}`); // Log the product ID
    console.log(`Product:`, product); // Log the product details
    console.log(`Quantity: ${quantity}`); // Log the new quantity

    if (quantity > 1) {
      //add alert to ask do you want to remove from the cart and if yes remove it if no keep it
      const confirmAnswer = confirm("Do you want to remove from the cart?");
      // confirmAnswer ?
    }
    //remove the old quantity from total
    total -= product.price * cartArr[productID];
    total += product.price * quantity;
    cartArr[productID] = quantity;
    $(".total-price").text(`Total: $${total}`);
  });
});
