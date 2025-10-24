export const metadata = {
  title: "Categories - YekZen",
  description: "Browse products by category at YekZen",
};

export default function CategoriesPage() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets and electronic devices",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      count: 156,
    },
    {
      id: 2,
      name: "Fashion",
      description: "Trendy clothing and accessories",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      count: 234,
    },
    {
      id: 3,
      name: "Home & Garden",
      description: "Everything for your home and garden",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      count: 89,
    },
    {
      id: 4,
      name: "Sports",
      description: "Sports equipment and fitness gear",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      count: 67,
    },
    {
      id: 5,
      name: "Books",
      description: "Wide selection of books and ebooks",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      count: 345,
    },
    {
      id: 6,
      name: "Beauty",
      description: "Cosmetics and personal care",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      count: 123,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of products organized by category. Find
            exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/products?category=${category.name.toLowerCase()}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group block"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 font-medium">
                    {category.count} products
                  </span>
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    View All →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
