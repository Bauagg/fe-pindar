import { useState } from "react";
import { NavLink } from "react-router-dom";

const Gallery = () => {
  const allImages = [
    {
      src: "/images/edu1.png",
      title: "Tips Pinjaman Daring yang Aman",
      category: "Garden",
    },
    {
      src: "/images/edu2.png",
      title: "Cerdas Finansial: Tips Aman Menggunakan Pinjaman Daring dan Cara Membedakannya",
      category: "Product",
    },
    {
      src: "/images/edu3.png",
      title: "Awas Kena Jebakan Pinjaman Ilegal!!",
      category: "Garden",
    },
  ];

  const categories = ["All", "Garden", "Product"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredImages = selectedCategory === "All" ? allImages : allImages.filter((img) => img.category === selectedCategory);

  return (
    <section className="bg-white pt-4 pb-12 max-w-6xl mx-auto px-7 md:px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Education Product</h2>

        <NavLink to="/apps" className="text-sm font-medium text-gray-700 hover:text-red-500 transition">
          View all →
        </NavLink>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((item, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer">
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover hover:scale-110 transition duration-300" />
            </div>

            {/* Title */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-red-800">{item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
