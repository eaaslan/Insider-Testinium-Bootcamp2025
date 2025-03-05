$(() => {
  let currentPage = 0;
  const limit = 7;
  let isLoading = false;

  const loadPost = () => {
    isLoading = true;
    $(".loading").show();
    $.getJSON("https://jsonplaceholder.typicode.com/posts", {
      _start: currentPage * limit,
      _limit: limit,
    })
      .done((posts) => {
        setTimeout(() => {
          isLoading = false;
          $(".loading").hide();
          $.each(posts, (index, post) => {
            const html = `
                              <div class="card">
                              <div class="card-body">
                                  <h5 class="card-title">${post.title}</h5> 
                                  <p class="card-text">${post.body}</p>
                              </div>
                              </div>
                              `;
            $(".postList").append(html);
          });
        }, 2000);

        currentPage++;
      })
      .fail((error) => {
        console.log(error);
      })
      .always(() => {});
  };
  loadPost();

  $(window).scroll(function () {
    if (
      $(window).scrollTop() + $(window).height() >
      $(document).height() - 100
    ) {
      if (!isLoading) {
        loadPost();
      }
    }
  });
});
