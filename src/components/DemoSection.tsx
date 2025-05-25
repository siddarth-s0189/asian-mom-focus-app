
import { Eye } from "lucide-react";

const DemoSection = () => {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-16 min-h-[300px] flex flex-col items-center justify-center">
            <Eye className="w-16 h-16 text-red-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Demo Video Coming Soon</h3>
            <p className="text-gray-400 max-w-md">
              Experience the full Asian mom treatment in our interactive demo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
