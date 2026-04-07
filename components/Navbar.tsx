import Link from "next/link";
import { Home, Info, Mail } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
            <Home size={18} />
          </div>
          <span>My App</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="flex items-center gap-1.5 hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/about" className="flex items-center gap-1.5 hover:text-black transition-colors">
            <Info size={16} />
            About
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-black transition-colors">
            <Mail size={16} />
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
