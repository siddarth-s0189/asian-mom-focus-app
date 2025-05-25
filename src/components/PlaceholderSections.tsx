
const PlaceholderSections = () => {
  return (
    <>
      {/* Success Stories */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Success Stories</h2>
          <p className="text-xl text-gray-400 mb-12">
            Real students, real results, real emotional damage
          </p>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12">
            <p className="text-gray-400 italic text-lg">
              "Coming soon - testimonials from students who survived the Asian mom treatment"
            </p>
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">App Screenshots</h2>
          <p className="text-xl text-gray-400 mb-12">
            See the sleek dark interface in action
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-16 min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Dashboard Preview</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-16 min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Session View</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Pricing Plans</h2>
          <p className="text-xl text-gray-400 mb-12">
            Choose your level of accountability
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Basic</h3>
              <div className="text-4xl font-bold text-red-500 mb-4">Free</div>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <p className="text-gray-500">Full feature list coming soon</p>
            </div>
            
            <div className="bg-gray-900 border border-red-600 rounded-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
              <div className="text-4xl font-bold text-red-500 mb-4">$9/mo</div>
              <p className="text-gray-400 mb-6">For serious students</p>
              <p className="text-gray-500">Full feature list coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400 mb-12">
            Everything you need to know about your AI Asian mom
          </p>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12">
            <p className="text-gray-400 italic text-lg">
              FAQ content coming soon - including questions about voice customization, strictness levels, and privacy
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlaceholderSections;
