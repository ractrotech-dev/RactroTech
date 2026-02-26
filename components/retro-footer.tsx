import Link from "next/link";

export function RetroFooter() {
  return (
    <footer className="bg-black border-t-4 border-yellow-400 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-black uppercase mb-4 text-yellow-400">RACTROTECH</h4>
            <p className="font-semibold">Digital Agency building amazing products.</p>
          </div>
          <div>
            <h4 className="font-black uppercase mb-4 text-yellow-400">SERVICES</h4>
            <ul className="space-y-2 font-semibold">
              <li>
                <a href="#services" className="hover:underline">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Mobile Apps
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  SaaS Solutions
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  AI Integration
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase mb-4 text-yellow-400">COMPANY</h4>
            <ul className="space-y-2 font-semibold">
              <li>
                <Link href="#about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="hover:underline">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:underline">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase mb-4 text-yellow-400">CONTACT</h4>
            <p className="font-semibold mb-2">contact@ractrotech.com</p>
            <p className="font-semibold mb-4">+1 (555) 123-4567</p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-yellow-400 text-black w-10 h-10 flex items-center justify-center font-black border-2 border-white hover:scale-110"
              >
                F
              </a>
              <a
                href="#"
                className="bg-yellow-400 text-black w-10 h-10 flex items-center justify-center font-black border-2 border-white hover:scale-110"
              >
                T
              </a>
              <a
                href="#"
                className="bg-yellow-400 text-black w-10 h-10 flex items-center justify-center font-black border-2 border-white hover:scale-110"
              >
                L
              </a>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-yellow-400 pt-8 text-center font-semibold">
          <p>&copy; 2024 RactroTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
