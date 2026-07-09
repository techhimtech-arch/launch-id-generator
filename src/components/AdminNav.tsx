import { NavLink } from "react-router-dom";
import { CreditCard, MessageSquare, Users, Crown, Gift } from "lucide-react";

const links = [
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/leads", label: "Leads", icon: Gift },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: Crown },
];

export default function AdminNav() {
  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b pb-3">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted border-border text-foreground"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
