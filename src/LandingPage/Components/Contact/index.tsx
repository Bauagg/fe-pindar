import React from "react";
import { BgChatMe } from "../../Assets/Images";

const DataValue = {
  url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d809.9919452191294!2d106.63616283293892!3d-6.27761987007987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fb059822e9b3%3A0x5cf506c411639319!2sRuko%20Northridge%20Business%20Center!5e0!3m2!1sid!2sid!4v1723779634262!5m2!1sid!2sid",
};

const Contact: React.FC = () => {
  return (
    <section className="bg-cover bg-center h-auto md:h-[350px] lg:h-[400px] lg:mb-[80px] md:mb-[50px] mb-[25px] bg-[#F7F7F7] overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between gap-8 ">
        <div className="lg:h-[100px] relative z-10">
          <div className="absolute lg:w-[900px] lg:mt-[50px] lg:h-[150px] md:w-[550px] md:h-[410px] w-[300px]  h-[200px]">
            <img
              src={BgChatMe}
              alt="bg"
              className="h-full w-full lg:h-[300px] md:mt-[70px] mt-[70px] lg:object-cover object-contain"
            />
          </div>
          <div className="flex flex-col justify-center px-4 md:px-6 lg:px-8 lg:pl-[50px]">
            <h1 className="text-2xl md:text-4xl font-inter text-left font-bold mb-4 md:mb-6 mt-4">
              Hubungi Kami
            </h1>
            <div className="text-[11px] text-[#252525] md:text-base text-left font-poppins flex flex-col gap-2">
              <div className="flex gap-4">
                <p className="w-[100px] md:w-[100px] ">Email</p>
                <p>:</p>
                <p> official@ultradigitalindonesia.co.id</p>
              </div>
              <div className="flex gap-4">
                <p className="w-[100px] md:w-[100px] ">Telepon</p>
                <p>:</p>
                <p>+62 8177 0912 555</p>
              </div>
              <div className="flex flex-row md:flex-row gap-4">
                <p className="w-[100px] md:w-[100px] ">Address</p>
                <p>:</p>
                <p className="flex-1 w-[200px] ">
                  Jl. Komp. BSD No : A3/28, Desa/Kelurahan Lengkong Wetan, Kec.
                  Serpong, Kota Tanggerang Selatan, Provinsi Banten - 15310
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full lg:mt-[0px] mt-[50px] mb-[20px] md:mt-[13px] md:w-[450px] md:h-[320px] lg:w-[700px] px-[16px]">
          <iframe
            src={DataValue.url}
            className="w-full md:h-full lg:h-[310px] h-[200px] border-0"
            allowFullScreen
            loading="lazy"
            title="Map"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
