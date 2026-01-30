import { navItems, navLinkClass } from "@/constants/navigation";

export default function Navigation() {
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navItems.map((item) => (
        <a key={item.label} href={item.href} className={navLinkClass}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
