export const metadata = {
  title: "About Us - YekZen",
  description: "Learn about YekZen - Your premium eCommerce destination",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About YekZen</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Your premier destination for premium products and exceptional
            shopping experiences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2025, YekZen has quickly become a trusted name in
                premium eCommerce. We started with a simple vision: to create a
                shopping experience that combines the convenience of online
                shopping with the quality and service you'd expect from a luxury
                boutique.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team of passionate professionals works tirelessly to curate
                the finest selection of products from around the world, ensuring
                that every item meets our exacting standards for quality, style,
                and value.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
                alt="Our team at work"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quality First
              </h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully
                selected and tested to ensure it meets our high standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Customer Focused
              </h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We go above and beyond to
                ensure you have an exceptional shopping experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sustainable
              </h3>
              <p className="text-gray-600">
                We're committed to sustainable practices and supporting brands
                that share our vision for a better future.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            By the Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust YekZen for their
            premium shopping needs.
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}
