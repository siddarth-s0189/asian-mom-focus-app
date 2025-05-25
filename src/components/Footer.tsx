
const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
              AM
            </div>
            <span className="text-white font-semibold text-lg">
              AsianMom<span className="text-red-500">.gg</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
