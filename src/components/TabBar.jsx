import {
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  Landmark,
  LayoutDashboard,
  Map,
  Scale,
  Shield,
  Users,
} from "lucide-react";
import { TAB_CONFIG } from "../data/tabs.js";

const TAB_ICONS = {
  dashboard: LayoutDashboard,
  budget: Briefcase,
  departments: Building2,
  council: Landmark,
  districts: Map,
  residents: Users,
  projects: ClipboardList,
  policies: Scale,
  services: Shield,
  story: BookOpen,
  chronicle: FileText,
};

export default function TabBar({ activeTab, disabled, onSetTab }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 pb-3">
      <div className="flex gap-2 overflow-x-auto">
        {TAB_CONFIG.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = TAB_ICONS[tab.id] ?? FileText;
          return (
            <button
              key={tab.id}
              className={active ? "tab-button is-active" : "tab-button"}
              disabled={disabled}
              aria-current={active ? "page" : undefined}
              onClick={() => onSetTab(tab.id)}
              title={disabled ? "The public record is active during city events" : tab.label}
            >
              <Icon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
