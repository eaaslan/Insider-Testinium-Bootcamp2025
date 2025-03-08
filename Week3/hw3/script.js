$(() => {
  const users = [];
  $.getJSON("https://randomuser.me/api/?results=6")
    .done((data) => {
      users.push(data.results);
      console.log(data.results);

      const cards = data.results
        .map((user) => {
          return `
          <div class="card">
            <img src="${user.picture.large}" alt="Avatar">
            <div class="info-container">
              <h4><b>${user.name.first} ${user.name.last}</b></h4>
              <p>${user.email}</p>
            </div>
          </div>
        `;
        })
        .join("");
      $(".user-cards").html(cards);

      const sliderCards = data.results
        .map(
          (user, index) => `
                            <div class="swiper-slide">
                                <div class="card">
                                    <img src="${user.picture.large}" alt="${user.name.first}">
                                    <div class="info-container">
                                        <h4>${user.name.first} ${user.name.last}</h4>
                                        <p>${user.email}</p>
                                    </div>
                                </div>
                            </div>
                        `
        )
        .join("");
      $(".swiper-wrapper").html(sliderCards);
      new Swiper(".swiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 30,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
      console.log(cards);
    })
    .fail((error) => {
      console.log(error);
    });

  $(document).on("click", ".card", function () {
    const index = $(this).index();
    const user = users[0][index];

    const phone = user.phone;
    const address = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`;
    const dob = new Date(user.dob.date).toLocaleDateString();

    Swal.fire({
      title: `${user.name.first} ${user.name.last}`,
      text: `Email: ${user.email}\nPhone: ${phone}\nAddress: ${address}\nDate of Birth: ${dob}`,
      imageUrl: `${user.picture.large}`,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "User image",
      html: `
          <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
        `,
    });
  });
});
