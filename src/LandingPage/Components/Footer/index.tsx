import { Facebook, Instagram, Mail, MapPin, Phone, ChevronRight } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  const menuLinks = [
    {
      title: "Beranda",
      path: "/",
    },
    {
      title: "Pindar",
      path: "/pindar",
    },
    {
      title: "Kartu Kredit",
      path: "/kartukredit",
    },
  ];

  const informationLinks = [
    {
      title: "Tentang Kami",
      path: "/legal/about",
    },
    {
      title: "Syarat & Ketentuan",
      path: "/legal/terms",
    },
    {
      title: "Kebijakan Privasi",
      path: "/legal/privacy",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-red-600 to-red-700 text-white mt-16 overflow-hidden">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-white/15
                  backdrop-blur-md
                  flex items-center justify-center
                  font-black
                  text-xl
                ">
                <img src="/images/pindar.png" alt="" className="w-10 h-12" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black">PINDAR</h2>

                <p className="text-red-100 text-sm">Platform Informasi Pinjaman Daring</p>
              </div>
            </div>

            <p
              className="
                mt-5
                text-sm sm:text-base
                text-red-100
                leading-relaxed
              ">
              Membantu masyarakat menemukan dan membandingkan layanan pinjaman daring legal secara lebih aman, transparan, dan terpercaya.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-3 mt-6">
              <Link
                to="https://www.instagram.com/pindar.id/"
                target="_blank"
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-white/10
                  hover:bg-white/20
                  transition-all duration-300
                  flex items-center justify-center
                ">
                <Instagram className="w-5 h-5" />
              </Link>

              <Link
                to="https://www.facebook.com/profile.php?id=61584208739946&sk=reels_tab"
                target="_blank"
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-white/10
                  hover:bg-white/20
                  transition-all duration-300
                  flex items-center justify-center
                ">
                <Facebook className="w-5 h-5" />
              </Link>

              <Link
                to="https://www.tiktok.com/@pindar.id"
                target="_blank"
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-white/10
                  hover:bg-white/20
                  transition-all duration-300
                  flex items-center justify-center
                ">
                <FaTiktok className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* MENU AND INFORMATION */}
          {/* <div className="flex  items-start gap-10"> */}
          {/* MENU */}
          <div>
            <h3 className="text-lg font-black mb-5">Menu</h3>

            <div className="space-y-3">
              {menuLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="
                    flex items-center gap-2
                    text-red-100
                    hover:text-white
                    transition-all duration-300
                    text-sm sm:text-base
                    group
                  ">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />

                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* INFORMATION */}
          <div>
            <h3 className="text-lg font-black mb-5">Informasi</h3>

            <div className="space-y-3">
              {informationLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="
                    flex items-center gap-2
                    text-red-100
                    hover:text-white
                    transition-all duration-300
                    text-sm sm:text-base
                    group
                  ">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />

                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          {/* </div> */}

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-black mb-5">Kontak</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div
                  className="
                    w-11 h-11
                    rounded-2xl
                    bg-white/10
                    flex items-center justify-center
                    shrink-0
                  ">
                  <MapPin className="w-5 h-5" />
                </div>

                <div>
                  <p className="font-semibold text-sm sm:text-base">Alamat</p>

                  <p className="text-red-100 text-sm leading-relaxed">
                    Wisma Nugra Santana <br />
                    Tanah Abang, Kota Jakarta Pusat, DKI Jakarta
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start gap-3">
                <div
                  className="
                    w-11 h-11
                    rounded-2xl
                    bg-white/10
                    flex items-center justify-center
                    shrink-0
                  ">
                  <Phone className="w-5 h-5" />
                </div>

                <div>
                  <p className="font-semibold text-sm sm:text-base">Telepon</p>

                  <p className="text-red-100 text-sm">+62 812-3456-7890</p>
                </div>
              </div> */}

              <div className="flex items-start gap-3">
                <div
                  className="
                    w-11 h-11
                    rounded-2xl
                    bg-white/10
                    flex items-center justify-center
                    shrink-0
                  ">
                  <Mail className="w-5 h-5" />
                </div>

                <div>
                  <p className="font-semibold text-sm sm:text-base">Email</p>

                  <p className="text-red-100 text-sm break-all">cs@pindar.id</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div
          className="
            max-w-7xl
            mx-auto
            px-4 sm:px-6 lg:px-8
            py-5
            flex flex-col md:flex-row
            items-center justify-between
            gap-3
          ">
          <p className="text-xs sm:text-sm text-red-100 text-center md:text-left">
            © 2026 <span className="font-bold text-white">PINDAR</span>. All Rights Reserved.
          </p>

          <p className="text-xs sm:text-sm text-red-100 text-center md:text-right">Dibuat untuk pengalaman finansial yang lebih aman & modern.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
