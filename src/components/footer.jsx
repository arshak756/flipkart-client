const Footer = () => {
  return (
    <footer className="bg-[#172337] text-white text-sm pt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        
        <div>
          <h3 className="text-gray-300 font-semibold mb-3">ABOUT</h3>
          <ul className="space-y-1 text-gray-400">
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Flipkart Stories</li>
            <li className="hover:underline cursor-pointer">Press</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-gray-300 font-semibold mb-3">HELP</h3>
          <ul className="space-y-1 text-gray-400">
            <li className="hover:underline cursor-pointer">Payments</li>
            <li className="hover:underline cursor-pointer">Shipping</li>
            <li className="hover:underline cursor-pointer">Cancellation</li>
            <li className="hover:underline cursor-pointer">Returns</li>
            <li className="hover:underline cursor-pointer">FAQ</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-gray-300 font-semibold mb-3">CONSUMER POLICY</h3>
          <ul className="space-y-1 text-gray-400">
            <li className="hover:underline cursor-pointer">Return Policy</li>
            <li className="hover:underline cursor-pointer">Terms Of Use</li>
            <li className="hover:underline cursor-pointer">Security</li>
            <li className="hover:underline cursor-pointer">Privacy</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-gray-300 font-semibold mb-3">SOCIAL</h3>
          <ul className="space-y-1 text-gray-400">
            <li className="hover:underline cursor-pointer">Facebook</li>
            <li className="hover:underline cursor-pointer">Twitter</li>
            <li className="hover:underline cursor-pointer">YouTube</li>
          </ul>
        </div>

    
        <div>
          <h3 className="text-gray-300 font-semibold mb-3">Mail Us:</h3>
          <p className="text-gray-400 text-xs leading-5">
            Flipkart Internet Private Limited, <br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village, <br />
            Outer Ring Road, Devarabeesanahalli Village, <br />
            Bengaluru, 560103, <br />
            Karnataka, India
          </p>
        </div>
      </div>

      
      <div className="border-t border-gray-700 mt-8 pt-4 pb-6 text-center text-gray-500 text-xs">
        © 2025 Flipkart Clone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
