
const FeaturesSection = () => {
  const features = [
    {
      emoji: "⏰",
      title: "Session Timer, Now With Fear",
      description: "Customizable focus sessions from 30 minutes to 6 hours. Your AI mom monitors every second and won't let you slack off."
    },
    {
      emoji: "💔",
      title: "Breaks Allowed. Guilt Not.",
      description: "Take strategic breaks without the shame. But don't expect your AI mom to be happy about it - she'll make sure you get back to work."
    },
    {
      emoji: "🔧",
      title: "Customize Your Mom's Strictness",
      description: "Adjust the 'Asianness' level from chill blue to insane red. Control how often she interrupts with motivational reality checks."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Productivity Features That Actually Work
          </h2>
          <p className="text-xl text-gray-400">
            Because generic timers are for people without Asian parents
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-red-500/50 transition-colors group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">
                {feature.emoji}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
