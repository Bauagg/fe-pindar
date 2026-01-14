// src/Components/WhatsAppButton.tsx
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppButtonProps {
  phoneNumber?: string; // default nomor WA
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber = "6288809250032" }) => {
  // Template pesan (pakai emoji + bold markdown WhatsApp)
  const message = `Hello HANTARA 👋
I would like to place an order with the following details:

🧑 *Name:*  
🏠 *Address:*  
📦 *Product:*  
🔢 *Quantity:*  
✍️ *Additional Notes:*`;

  // Encode pesan biar aman dipakai di URL
  const encodedMessage = encodeURIComponent(message);
  const Icon = FaWhatsapp as React.FC<React.SVGProps<SVGSVGElement>>;
  return (
    <div>
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition transform hover:scale-110">
        <div className="relative">
          {/* 🔴 Red blinking dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>

          <Icon className="w-10 h-10" />
        </div>
      </a>
    </div>
  );
};

export default WhatsAppButton;
