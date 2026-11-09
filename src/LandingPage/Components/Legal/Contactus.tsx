import { Headset, MessageCircle, Mail, MapPin, ArrowUpRight } from "lucide-react";

const WA_NUMBER = "628134262738"; // 08134262738 dalam format internasional
const WA_MESSAGE = "Halo Pindar, saya ingin bertanya mengenai layanan Pindar.";
const EMAIL = "cs@pindar.id";
const ADDRESS_NAME = "Wisma Nugra Santana";
const ADDRESS_AREA = "Tanah Abang, Kota Jakarta Pusat, DKI Jakarta";

const contacts = [
  {
    title: "WhatsApp",
    description: "Kirim pesan langsung ke tim kami melalui WhatsApp.",
    value: "0813-4262-738",
    cta: "Kirim Pesan WhatsApp",
    href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`,
    icon: MessageCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    external: true,
  },
  {
    title: "Email",
    description: "Kirim pertanyaan, masukan, atau permintaan informasi melalui email.",
    value: EMAIL,
    cta: "Kirim Email",
    href: `mailto:${EMAIL}`,
    icon: Mail,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    external: false,
  },
];

const ContactUs = () => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_NAME}, ${ADDRESS_AREA}`)}`;

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <Headset className="w-6 h-6 text-red-500" />
        </div>

        <div>
          <h2 className="text-xl md:text-3xl font-black text-gray-800">Hubungi Kami</h2>

          <p className="mt-2 text-gray-500 text-xs md:text-base">Kami siap membantu pertanyaan Anda seputar Pindar</p>
        </div>
      </div>

      {/* INTRO */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-[2rem] p-6 lg:p-8 mb-8">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">Punya pertanyaan, kendala, atau masukan terkait platform Pindar? Pilih salah satu cara di bawah ini untuk menghubungi tim kami.</p>

        <p className="mt-4 text-gray-700 leading-relaxed font-semibold text-sm md:text-base">Pesan Anda akan kami balas secepat mungkin.</p>
      </div>

      {/* CONTACT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="bg-white border border-gray-100 rounded-[2rem] shadow-lg p-6 lg:p-8 flex flex-col">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>

                <h3 className="text-lg md:text-2xl font-black text-gray-800">{item.title}</h3>
              </div>

              <p className="mt-5 text-gray-700 leading-relaxed text-sm md:text-base">{item.description}</p>

              <p className="mt-3 font-semibold text-gray-800 text-sm md:text-base break-all">{item.value}</p>

              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm md:text-base px-6 py-3 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200">
                {item.cta}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>

      {/* ADDRESS */}
      <div className="mt-6 bg-white border border-gray-100 rounded-[2rem] shadow-lg p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-red-500" />
          </div>

          <h3 className="text-lg md:text-2xl font-black text-gray-800">Alamat Kami</h3>
        </div>

        <div className="mt-5 space-y-1">
          <p className="font-semibold text-gray-800 text-sm md:text-base">{ADDRESS_NAME}</p>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">{ADDRESS_AREA}</p>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm md:text-base px-6 py-3 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200">
          Lihat di Google Maps
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
