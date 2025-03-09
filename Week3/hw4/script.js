const productsArr = [];
const cartArr = {};
let total = 0;

$(() => {

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cartItems');
    const savedTotal = localStorage.getItem('cartTotal');
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      Object.assign(cartArr, parsedCart);

      if (savedTotal) {
        total = parseFloat(savedTotal);
        $(".total-price").text(`Total: $${total.toFixed(2)}`);
      }
    }
  };
  const saveCartToStorage = () => {
    localStorage.setItem('cartItems', JSON.stringify(cartArr));
    localStorage.setItem('cartTotal', total.toString());
  };
  const loadPost = () => {
    $.getJSON("https://fakestoreapi.com/products").done((products) => {
      productsArr.push(...products);

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
      
      loadCartFromStorage();
      renderCartItems();

      if ($('#product-lightbox').length === 0) {
        $('body').append(`
          <div id="product-lightbox" style="display:none;">
            <div class="lightbox-content">
              <div class="lightbox-close"><i class='bx bx-x'></i></div>
              <div class="lightbox-image"></div>
              <div class="lightbox-details">
                <h2 class="lightbox-title"></h2>
                <p class="lightbox-description"></p>
                <div class="lightbox-price"></div>
                <button class="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        `);
      }
    });
  };

  const renderCartItems = () => {
    $(".cart-content .cart-box").remove();
    Object.entries(cartArr).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = productsArr[parseInt(productId) - 1];
        const productBox = $(`.product-box[data-id="${productId}"]`).clone();
        productBox.removeClass("product-box").addClass("cart-box");
        productBox.find(".add-cart").remove();
        productBox.find(".card-body").append(`<input type="number" value="${quantity}" class="cart-quantity" />`);
        productBox.find(".card-body").append('<i class="bx bx-trash cart-remove"></i>');
        $(".cart-content").prepend(productBox);
      }
    });
  };

  addProductToCart = (product) => {
    const productId = product.id.toString();
    if (cartArr[productId] > 0) {
      const quantity = $(`.cart-box[data-id="${productId}"] .cart-quantity`);
      quantity.val(parseInt(quantity.val()) + 1);
      cartArr[productId]++;
    } else {
      cartArr[productId] = 1;
      const productBox = $(`.product-box[data-id="${productId}"]`).clone();
      productBox.removeClass("product-box").addClass("cart-box");
      productBox.find(".add-cart").remove();
      productBox.find(".card-body").append('<input type="number" value="1" class="cart-quantity" />');
      productBox.find(".card-body").append('<i class="bx bx-trash cart-remove"></i>');
      
      $(".cart-content").prepend(productBox);
    }
    total += product.price;
    $(".total-price").text(`Total: $${total.toFixed(2)}`);
    saveCartToStorage();
  };
  loadPost();

  $("#cart-icon").click(function (e) {
    e.stopPropagation();
    $(".cart").toggleClass("active");
  });

  $("#close-cart").click(function (e) {
    $(".cart").removeClass("active");
  });
  $(document).click(function () {
    $(".cart").removeClass("active");
  });
  $(".cart").click(function (e) {
    e.stopPropagation();
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
    saveCartToStorage();
  };

  $(".cart-content").on("click", ".cart-remove", function () {
    const productID = $(this).closest(".cart-box").data("id");
    removeProductFromCard(productID);
  });

  $(".cart-content").on("change", ".cart-quantity", function () {
    const productID = $(this).closest(".cart-box").data("id");
    const product = productsArr[productID - 1];
    const quantity = parseInt($(this).val());

    if (quantity <= 0) {
      removeProductFromCard(productID);
    } else {
      total -= product.price * cartArr[productID];
      total += product.price * quantity;
      cartArr[productID] = quantity;
      $(".total-price").text(`Total: $${total.toFixed(2)}`);
      saveCartToStorage();
    }
  });

  $(".shop-content").on("click", ".product-box", function(e) {
    if ($(e.target).hasClass('add-cart') || $(e.target).closest('.add-cart').length) {
      return;
    }
    
    const productID = $(this).data("id");
    const product = productsArr[productID - 1];
    
    $('#product-lightbox .lightbox-image').html(`<img src="${product.image}" alt="${product.title}">`);
    $('#product-lightbox .lightbox-title').text(product.title);
    $('#product-lightbox .lightbox-description').text(product.description);
    $('#product-lightbox .lightbox-price').text(`$${product.price}`);
    
    $('#product-lightbox .add-to-cart-btn').data('product-id', productID);
    
    $('#product-lightbox').css({
      'display': 'flex',
      'opacity': 0
    }).animate({
      opacity: 1
    }, 300);
    
    $('.lightbox-content').css({
      'transform': 'scale(0.8)',
      'opacity': 0
    }).animate({
      transform: 'scale(1)',
      opacity: 1
    }, 300);
  });
  
  $('body').on('click', '#product-lightbox .lightbox-close', function() {
    $('#product-lightbox').animate({
      opacity: 0
    }, 300, function() {
      $(this).hide();
    });
  });
  
  $('body').on('click', '#product-lightbox', function(e) {
    if ($(e.target).is('#product-lightbox')) {
      $('#product-lightbox').animate({
        opacity: 0
      }, 300, function() {
        $(this).hide();
      });
    }
  });
  
  $('body').on('click', '#product-lightbox .add-to-cart-btn', function() {
    const productID = $(this).data('product-id');
    const product = productsArr[productID - 1];
    addProductToCart(product);
    
    $(this).text('Added to Cart!').addClass('added');
    setTimeout(() => {
      $(this).text('Add to Cart').removeClass('added');
    }, 2000);
  });
});
