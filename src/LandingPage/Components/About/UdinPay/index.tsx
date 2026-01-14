import React from "react";
import { frameUdin, ImageGoogleStore, ImagePhone4, ImagePlayStore } from "../../../Assets/Images";
import { IconKominfo } from "./Icon";

const UdinPay: React.FC = () => {
  return (
    <section className="lg:mx-[40px] md:mx-[14px] mb-[60px] lg:mb-[100px]">
      <section className="text-left flex flex-col  md:flex-row justify-between mx-4 lg:mx-[50px] xl:mx-0 rounded-2xl mt-10 lg:mt-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${frameUdin})` }}>
        <div className="flex flex-col gap-5 lg:gap-10 md:gap-5 w-full md:w-1/2 p-4 lg:p-8">
          <div className="text-[#F7F7F7]">
            <h1 className="text-2xl lg:text-4xl font-bold">Udin</h1>
            <p className="text-[14px] lg:text-2xl font-poppins mt-4">Unduh sekarang dan nikmati pengalaman E-Wallet yang cepat, mudah, dan aman. Klik tautan di bawah ini untuk install Aplikasi dan mulailah bertransaksi!</p>
          </div>
          <div className="flex gap-4 md:gap-2 lg:gap-8 flex-wrap">
            <div>
              <img src={ImageGoogleStore} alt="Google Store" className="w-32 lg:w-40" />
            </div>
            <div>
              <img src={ImagePlayStore} alt="Play Store" className="w-32 lg:w-40" />
            </div>
          </div>
          <div>
            <p className="text-[12px] lg:text-[16px] font-poppins text-white">Udin sudah terdaftar di:</p>
            <div className="mt-[8px] hidden lg:block">{IconKominfo("150", "32")}</div>
            <div className="mt-[4px] lg:hidden block">{IconKominfo("81", "18")}</div>
            {/* <div className="mt-[8px] w-[90px] lg:w-[160px] lg:h-[32px] md:h-[16px] h-[14px] left">
              <img
                src={LogoImage}
                alt=""
                className="w-full h-full object-contain"
              />
            </div> */}
          </div>
        </div>
        <div className="flex justify-center">
          <div className=" w-40  md:w-[230px] lg:w-[365px] ">
            <img src={ImagePhone4} alt="Phone" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>
    </section>
  );
};

export default UdinPay;
