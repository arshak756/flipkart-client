import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";



const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const electronicsRef = useRef(null);
  const appliancesRef = useRef(null);
  const toysRef = useRef(null);


  useEffect(() => {
    fetch("https://flipkart-server-side-1.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error:", err));
  }, []);

  const bestOfElectronics = [
    {
      title: "TWS Wireless",
      keyword: "tws",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/l/p/4/-original-imagtvqpkzkedv8p.jpeg?q=70",
    },
    {
      title: "Power Banks",
      keyword: "powerbank",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/power-bank/l/i/7/-original-imahdthbcurxuh7a.jpeg?q=70",
    },
    {
      title: "Monitors",
      keyword: "monitor",
      image:
        "https://rukminim2.flixcart.com/image/312/312/xif0q/monitor/9/s/g/-original-imahyx2pm5wahngb.jpeg?q=70",
    },
    {
      title: "Soundbars",
      keyword: "soundbar",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/q/m/b/-original-imahfg2nfzfu6yhn.jpeg?q=70",
    },
    {
      title: "Gaming Accessories",
      keyword: "gaming",
      image:
        "https://rukminim2.flixcart.com/image/612/612/kua4r680/gaming-accessory-kit/mobile-gaming-trigger/z/6/0/battlemods-ninjax-for-bgmi-pubg-cod-free-fire-spinbot-original-imag7gytshzbsccg.jpeg?q=70",
    },
    {
      title: "Printers",
      keyword: "printer",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/printer/s/8/d/-original-imafkykednshkhx5.jpeg?q=70",
    },
    {
      title: "WiFi Routers",
      keyword: "router",
      image:
        "https://rukminim2.flixcart.com/image/312/312/xif0q/router/v/a/g/dir-615-d-link-original-imah4tp82m8gc5gc.jpeg?q=70",
    },
  ];

  const smartphoneBrands = ["Samsung", "Apple", "Realme", "Redmi"];

  const fashionDeals = [
    {
      title: "Men's Clothing",
      image:
        "https://rukminim2.flixcart.com/image/612/612/l1jmc280/shirt/m/f/y/m-shirt004-urbano-fashion-original-imagd7kyjgx9bhhx.jpeg?q=70",
    },
    {
      title: "Women's Wear",
      image:
        "https://rukminim2.flixcart.com/image/612/612/kxz0pe80/ethnic-set/d/g/s/xxl-set056-yellow-akshay-creation-original-imagabv4cykczgke.jpeg?q=70",
    },
    {
      title: "Footwear",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/7/a/d/7-vn-2023-blk-41-bruton-black-original-imagqt8nuztffjwa.jpeg?q=70",
    },
    {
      title: "Watches",
      image:
        "https://rukminim2.flixcart.com/image/612/612/k0vbgy80/watch/z/f/u/269-sm02-sonata-original-imafkgvhhfrzqg7k.jpeg?q=70",
    },
  ];

  const toysGames = products
    .filter((p) => p.category.toLowerCase() === "toys")
    .slice(0, 8);

  const appliances = products
    .filter((p) => p.category.toLowerCase() === "appliances")
    .slice(0, 8);

  const scroll = (ref, dir) => {
    if (ref.current) {
      const amount = 300;
      ref.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#f1f3f6]">
      <HeroCarousel />

      {/* 🔌 Best of Electronics */}
<section className="w-full px-4 py-10 relative">
  <h2 className="text-2xl font-bold mb-5 text-gray-800">Best of Electronics</h2>

  {/* Large screens: evenly spaced layout */}
  <div className="hidden lg:flex gap-6 justify-start flex-wrap">
    {bestOfElectronics.map((item) => (
      <div
        key={item.keyword}
        onClick={() =>
          navigate(`/category/electronics?search=${item.keyword}`)
        }
        className="w-[180px] bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-32 mx-auto object-contain"
        />
        <h3 className="text-sm font-medium mt-2 truncate">{item.title}</h3>
        <p className="mt-1 text-blue-600 font-bold text-sm">Shop Now!</p>
      </div>
    ))}
  </div>

  {/* Small screens: horizontal scroll with arrows */}
  <div className="lg:hidden relative">
    {/* Arrows */}
    <div className="flex justify-between absolute top-[40%] left-2 right-2 z-10">
      <button
        onClick={() => electronicsRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
        className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
      >
        ←
      </button>
      <button
        onClick={() => electronicsRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
        className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
      >
        →
      </button>
    </div>

    <div
      ref={electronicsRef}
      className="flex overflow-x-auto gap-4 pl-4 pr-1 scroll-smooth no-scrollbar"
    >
      {bestOfElectronics.map((item) => (
        <div
          key={item.keyword}
          onClick={() =>
            navigate(`/category/electronics?search=${item.keyword}`)
          }
          className="min-w-[160px] bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center cursor-pointer"
        >
          <img
            src={item.image}
            alt={item.title}
            className="h-32 mx-auto object-contain"
          />
          <h3 className="text-sm font-medium mt-2 truncate">{item.title}</h3>
          <p className="mt-1 text-blue-600 font-bold text-sm">Shop Now!</p>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Best of Smartphones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Repeat this block for Samsung, Apple, Realme, Redmi */}
          {[
            {
              brand: "Samsung",
              tagline: "Galaxy Series Smartphones",
              link: "/category/smartphones?brand=samsung",
              phones: [
                { img: "https://electronicparadise.in/cdn/shop/files/5_df7b1222-8a60-4b6b-bb78-f873cc6408a4.png?v=1702452453&width=1406", offer: "20% Off" },
                { img: "https://www.spark.co.nz/content/dam/spark/images/product-images/devices/phones/samsung/s25-series/s25-ultra/titanium-silver-blue/s25-ultra-titanium-silver-blue-1.png", offer: "22% Off" },
                { img: "https://sathya.in/media/93967/catalog/Cobalt%20Violet-1.jpg", offer: "15% Off" },
                { img: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1710958085/Croma%20Assets/Communication/Mobiles/Images/305507_0_l9z9rj.png?tr=w-600", offer: "25% Off" },
              ],
            },
            {
              brand: "Apple",
              tagline: "iPhones & Best Deals",
              link: "/category/smartphones?brand=apple",
              phones: [
                { img: "https://5.imimg.com/data5/SELLER/Default/2023/6/312743853/CM/HM/IA/4630526/apple-iphone-14-pro-max-128gb-deep-purple-mobile-phone.png", offer: "18% Off" },
                { img: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1744357287/Croma%20Assets/Communication/Mobiles/Images/309750_0_nqygi1.png", offer: "20% Off" },
                { img: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1744356790/Croma%20Assets/Communication/Mobiles/Images/309699_0_dr7vjz.png", offer: "15% Off" },
                { img: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1747749892/Croma%20Assets/Communication/Mobiles/Images/300684_0_scqozo.png", offer: "25% Off" },
              ],
            },
            {
              brand: "Realme",
              tagline: "Budget & Gaming Smartphones",
              link: "/category/smartphones?brand=realme",
              phones: [
                { img: "https://www.bigcmobiles.com/media/catalog/product/cache/e19e56cdd4cf1b4ec073d4305f5db95a/r/e/realme_14x_5g_crystal_black__1.jpg", offer: "20% Off" },
                { img: "https://image01.realme.net/general/20230512/1683873815640.png", offer: "18% Off" },
                { img: "https://image01.realme.net/general/20250311/174168299010277560175377b4f67bdbe20cb1c1ac08d.png", offer: "25% Off" },
                { img: "https://img-prd-pim.poorvika.com/product/Realme-13-plus-5g-dark-purple-256gb-8gb-ram-Front-Back-View.png", offer: "30% Off" },
              ],
            },
            {
              brand: "Redmi",
              tagline: "Redmi Note & Prime Series",
              link: "/category/smartphones?brand=redmi",
              phones: [
                { img: "https://i02.appmifile.com/30_operatorx_operatorx_opx/24/06/2024/965dad479bbe458c5119d225cea6ba5e.png", offer: "15% Off" },
                { img: "https://assets.gadgetandgear.com/upload/media/1718097864369712.jpeg", offer: "18% Off" },
                { img: "https://i03.appmifile.com/201_item_in/17/12/2024/0321927c81d71d28eb19b7ac43b4c86d.png", offer: "20% Off" },
                { img: "https://cdn.beebom.com/mobile/redmi-note-14-pro-plus/redmi-note-14-pro-plus-black.png", offer: "28% Off" },
              ],
            },
          ].map((brandData, index) => (
            <div
              key={index}
              onClick={() => navigate(brandData.link)}
              className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer p-6 h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-1">{brandData.brand}</h3>
                <p className="text-sm text-center text-gray-500 mb-5">{brandData.tagline}</p>
                <div className="grid grid-cols-2 gap-4">
                  {brandData.phones.map((item, i) => (
                    <div key={i} className="border rounded-lg p-3 text-center shadow-sm hover:shadow transition">
                      <img src={item.img} className="h-36 w-full object-contain" />
                      <p className="text-green-600 text-xs font-semibold mt-2">{item.offer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>




      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Fashion Deals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              title: "Men's Clothing",
              tagline: "Trendy & Comfortable",
              link: "/category/fashion?type=men",
              items: [
                {
                  img: "https://hips.hearstapps.com/hmg-prod/images/mh-1-4-outerwear-1641320113.png?crop=0.502xw:1.00xh;0.498xw,0&resize=640:*",
                  offer: "Min. 40% Off",
                },
                {
                  img: "https://surhi.in/cdn/shop/files/DSC00200_7027e3c4-5e2d-457b-8128-7fa380b23510.jpg?v=1720432249",
                  offer: "Min. 35% Off",
                },
                {
                  img: "https://surhi.in/cdn/shop/files/DSC00265_0c6d32a5-ee7f-436d-a8a1-c0ca3bcb1481.jpg?v=1720864336",
                  offer: "Min. 50% Off",
                },
                {
                  img: "https://blog.g3fashion.com/wp-content/uploads/2021/06/Mens-Casual-Outing-Style.jpg  ",
                  offer: "Min. 45% Off",
                },
              ],
            },
            {
              title: "Women's Wear",
              tagline: "Elegant & Stylish",
              link: "/category/fashion?type=women",
              items: [
                {
                  img: "https://rukminim2.flixcart.com/image/850/1000/xif0q/dress/b/i/g/s-long-maxi-stylist-party-wear-printed-one-piece-western-dress-original-imagrh96z7d4nshh.jpeg?q=90&crop=false",
                  offer: "Min. 50% Off",
                },
                {
                  img: "https://rukminim2.flixcart.com/image/612/612/kvfkivk0/abaya-burqa/v/g/1/s-9149-mrc-original-imag8bvtkyepwwsz.jpeg?q=70",
                  offer: "Min. 35% Off",
                },
                {
                  img: "https://rukminim2.flixcart.com/image/850/1000/l071d3k0/dress/0/o/z/xl-combo-two-dress-25-78-urban-creation-original-imagcf4mdnz87cmd.jpeg?q=90&crop=false",
                  offer: "Min. 30% Off",
                },
                {
                  img: "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/k/u/e/free-saree-new2023-designer-offer-deal-silk-saree-wedding-saree-original-imahbqzzthfcwzh8.jpeg?q=70",
                  offer: "Min. 45% Off",
                },
              ],
            },
            {
              title: "Footwear",
              tagline: "Stylish & Durable",
              link: "/category/fashion?type=footwear",
              items: [
                {
                  img: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/j/j/g/-original-imahan42sndpggka.jpeg?q=70",
                  offer: "Min. 40% Off",
                },
                {
                  img: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/s/2/k/-original-imah4syzggxzmahu.jpeg?q=70",
                  offer: "Min. 50% Off",
                },
                {
                  img: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/5/x/j/6-29434329450-6-khadim-s-maroon-original-imah3gfq2kr5gw9b.jpeg?q=70",
                  offer: "Min. 35% Off",
                },
                {
                  img: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/d/o/g/-original-imahd2pyysf2nfbf.jpeg?q=70",
                  offer: "Min. 60% Off",
                },
              ],
            },
            {
              title: "Watches",
              tagline: "Branded Collection",
              link: "/category/fashion?type=watches",
              items: [
                {
                  img: "https://assets.ajio.com/medias/sys_master/root/20230921/meKx/650c4c2bddf7791519efcd10/skylona_black_chronograph_watch.jpg",
                  offer: "Min. 25% Off",
                },
                {
                  img: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwa7b344a2/images/Titan/Catalog/90110WL04_1.jpg?sw=600&sh=600",
                  offer: "Min. 45% Off",
                },
                {
                  img: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw8c381799/images/Titan/Catalog/1843WL01_2.jpg?sw=600&sh=600",
                  offer: "Min. 35% Off",
                },
                {
                  img: "https://in.danielwellington.com/cdn/shop/products/731ffc3293c27cb7ae988a77f0db561c635e3b38.png?v=1679929601&width=1500",
                  offer: "Min. 50% Off",
                },
              ],
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.link)}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer p-6 h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-center text-gray-500 mb-5">
                  {item.tagline}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {item.items.map((el, j) => (
                    <div
                      key={j}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={el.img}
                        className="h-60 w-full object-cover"
                        alt={item.title}
                      />
                      <p className="text-green-600 text-xs font-semibold text-center py-2 bg-gray-50">
                        {el.offer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="w-full pt-10 pb-20 relative">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 ml-4">Toys & Games</h2>

        {/* Arrows only for small screens */}
        <div className="flex justify-between items-center lg:hidden absolute top-[50%] left-2 right-2 z-10">
          <button
            onClick={() => toysRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
            className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() => toysRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
            className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
          >
            →
          </button>
        </div>

        {/* Responsive Container */}
        <div
          ref={toysRef}
          className="lg:grid lg:grid-cols-6 gap-20 flex overflow-x-auto scroll-smooth no-scrollbar ml-4 pr-4"
        >
          {[
            {
              name: "Remote Control Car",
              sub: "Remote Cars",
              img: "https://rukminim2.flixcart.com/image/612/612/xif0q/remote-control-toy/t/h/a/anti-gravity-wall-climbing-car-with-remote-control-6-playgo-original-imah3zvypxcrptbf.jpeg?q=70",
              offer: "Min. 40% Off",
            },
            {
              name: "Building Blocks",
              sub: "Blocks",
              img: "https://rukminim2.flixcart.com/image/612/612/xif0q/block-construction/h/q/t/house-building-block-165-pcs-kids-blocks-blok-toddlers-buddy-original-imahdfxah7uhayb3.jpeg?q=70",
              offer: "Min. 50% Off",
            },
            {
              name: "Barbie Doll",
              sub: "Dolls",
              img: "https://rukminim2.flixcart.com/image/612/612/xif0q/doll-doll-house/a/h/w/-original-imahy9g3zchypz7q.jpeg?q=70",
              offer: "Min. 35% Off",
            },
            {
              name: "Hot Wheels Track Set",
              sub: "Track Sets",
              img: "https://rukminim2.flixcart.com/image/612/612/xif0q/vehicle-pull-along/2/p/z/-original-imagyjfewdzzwnkg.jpeg?q=70",
              offer: "Min. 45% Off",
            },
            {
              name: "Soft Teddy Bear",
              sub: "Stuffed Toys",
              img: "https://rukminim2.flixcart.com/image/612/612/kmf7ki80/stuffed-toy/c/t/z/big-teddy-bear-wearing-i-love-u-customise-your-name-t-shirt-72-original-imagfbhm9yysqypw.jpeg?q=70",
              offer: "Min. 60% Off",
            },
            {
              name: "Kids Musical Toy",
              sub: "Musical Toys",
              img: "https://rukminim2.flixcart.com/image/612/612/xif0q/baby-rattle/n/l/i/drumming-and-dancing-action-for-kids-baby-rattle-toys-set-original-imagr72wuzbnnjht.jpeg?q=70",
              offer: "Min. 55% Off",
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(`/category/toys?search=${encodeURIComponent(item.sub)}`)}
              className="min-w-[160px] max-w-[160px] lg:w-full bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer text-center flex-shrink-0"
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-32 w-full object-contain mx-auto"
              />
              <h4 className="mt-2 text-sm font-semibold text-gray-800 truncate">
                {item.name}
              </h4>
              <p className="text-green-600 text-xs font-semibold mt-1">{item.offer}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="w-full px-4 py-10 relative">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          Best of Home Appliances
        </h2>

        {/* Arrow buttons (ONLY for small screens) */}
        <div className="flex justify-between items-center lg:hidden absolute top-[50%] left-2 right-2 z-10">
          <button
            onClick={() =>
              appliancesRef.current?.scrollBy({ left: -300, behavior: "smooth" })
            }
            className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() =>
              appliancesRef.current?.scrollBy({ left: 300, behavior: "smooth" })
            }
            className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
          >
            →
          </button>
        </div>

        {/* Main container */}
        <div
          ref={appliancesRef}
          className="lg:grid lg:grid-cols-4 gap-20 flex overflow-x-auto scroll-smooth no-scrollbar"
        >
          {[
            {
              title: "Refrigerators",
              keyword: "refrigerator",
              image:
                "https://rukminim2.flixcart.com/image/612/612/k7nnrm80/refrigerator-new/6/z/f/gl-s292rdsy-2-lg-original-imafpujnvxhpqws3.jpeg?q=70",
            },
            {
              title: "Washing Machines",
              keyword: "washing",
              image:
                "https://rukminim2.flixcart.com/image/312/312/xif0q/washing-machine-new/m/r/e/-original-imagx7qmg7cmycjr.jpeg?q=70",
            },
            {
              title: "Microwaves",
              keyword: "microwave",
              image:
                "https://rukminim2.flixcart.com/image/312/312/xif0q/microwave-new/i/r/o/-original-imah6dzajzhbqfum.jpeg?q=70",
            },
            {
              title: "Air Conditioners",
              keyword: "air conditioner",
              image:
                "https://rukminim2.flixcart.com/image/612/612/xif0q/air-conditioner-new/4/b/y/no-ftkm35uv16w-1-2022-split-inverter-daikin-original-imahax3pdwphyzv6.jpeg?q=70",
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() =>
                navigate(`/category/appliances?search=${encodeURIComponent(item.keyword)}`)
              }
              className="min-w-[180px] max-w-[180px] lg:w-full bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center cursor-pointer flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-32 w-full object-contain mx-auto"
              />
              <h3 className="text-sm font-medium mt-2 truncate">{item.title}</h3>
              <p className="mt-1 text-blue-600 font-bold text-sm">Shop Now!</p>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
};

export default Home;
