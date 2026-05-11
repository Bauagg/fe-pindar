import { Building2, FileText, ShieldCheck } from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  {
    id: "about",
    label: "About Us",
    icon: Building2,
  },
  {
    id: "terms",
    label: "Terms & Condition",
    icon: FileText,
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
  },
];

const LegalTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-3 flex flex-wrap gap-3 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2
              px-5 py-3 rounded-2xl
              font-bold transition-all duration-300
              ${activeTab === tab.id ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}>
            <Icon className="w-5 h-5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default LegalTabs;
