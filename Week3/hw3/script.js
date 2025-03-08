$(() => {
  const loadPost = () => {
    $.getJSON("https://fakestoreapi.com/products").done((products) => {
      const html = products
        .map((product) => {
          console.log(product.image);
          return `
        <div class="card">
         <div class="card-img">
          <img src="${product.image.trim()}" alt="">
          </div>
         <div class="card-body>
          <h5 class="card-title>${product.title}</h5>
         </div>      
        </div>
        `;
        })
        .join("");

      $(".product-list").append(html);
    });
  };

  loadPost();
});
