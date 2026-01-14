import React from "react";

const Regulasi = () => {
  const regulations = [
    "Perubahan kebijakan publik yang mengedepankan perspektif/pendekatan social security id berbagai level dan aspek kehidupan masyarakat bagi sector pekerja atau tenaga kerja.",
    "Menguatkan pemahaman, kemampuan dan partisipasi pekerja atau tenaga kerja di dalam mendorong lahirnya social security dan civil society.",
    "Meningkatnya peran serta dan partisipasi pekerja atau tenaga kerja di dalam mendorong lahirnya bentuk-bentuk kebijakan publik yang berbasis pendekatan/perspektif social security.",
    "Mengoptimalkan potensi modal sosial, modal ekonomi, modal politik dan modal budaya sebagai basis dasar di dalam mendorong transformasi struktur sosial yang mengedepankan social security bagi pekerja atau tenaga kerja.",
    "Mengeliminasi segala bentuk dampak negatif dari industrialisasi, modernisasi dan digitalisasi bagi sector pekerja atau tenaga kerja, serta ketidakadilan struktural karena disebabkan oleh lemahnya social security dalam masyarakat.",
  ];

  return (
    <div className="w-full mx-2 px-4 sm:px-6 lg:px-8 pb-8 ">
      <div className="border rounded-lg overflow-hidden shadow-lg me-4 lg:me-5">
        {/* Title Section */}
        <div className="bg-[#144470] text-white font-semibold p-4 md:p-6">
          <h2 className="text-lg md:text-xl lg:text-2xl text-center md:text-left">OUTPUT</h2>
        </div>

        {/* Regulations List */}
        <div className="bg-white p-4 md:p-6 space-y-3">
          {regulations.map((regulation, index) => (
            <div key={index} className="text-sm md:text-base border-b pb-4 hover:text-[#144470] cursor-pointer text-justify">
              {regulation}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Regulasi;
