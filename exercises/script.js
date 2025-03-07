$(() => {
  $(".red-box").fadeOut(3000);
  $(".green-box").fadeOut(3000);
  //  $(".blue-box").fadeOut(2000);
  $(".blue-box").fadeOut(1000);
  $(".blue-box").fadeIn(1000);
  $(".red-box").fadeIn(5000);

  $(".lightbox").fadeIn(1000);
});

// Lightbox'u kapatmak için bir fonksiyon
function closeLightbox() {
  $(".lightbox").css("display", "none"); // Lightbox'u gizle
}

// Örnek olarak, lightbox'u açmak için bir olay dinleyici ekleyebilirsiniz
$(document).ready(function () {
  // Lightbox'a tıklanırsa kapat
  $(".lightbox").on("click", function () {
    closeLightbox();
  });
});
