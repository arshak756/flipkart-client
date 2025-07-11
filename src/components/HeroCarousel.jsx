import Slider from "react-slick";

const HeroCarousel = () => {
  const banners = [
    {
      id: 1,
      image: "https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/3658c47952d056fd.jpg?q=60",
    },
    {
      id: 2,
      image: "https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/8635f73b91ba25ec.jpeg?q=60",
    },
    {
      id: 3,
      image: "https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/de65a463259b7ebb.jpg?q=60",
    },
    {
      id: 3,
      image: "https://rukminim1.flixcart.com/fk-p-flap/3240/540/image/5b309e98775e22e4.jpg?q=60",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="rounded overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner) => (
          <img
            key={banner.id}
            src={banner.image}
            alt={`Banner ${banner.id}`}
            className="w-full h-52 md:h-72 object-cover"
          />
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
