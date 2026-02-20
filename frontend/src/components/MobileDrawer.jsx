import { useRecoilState } from "recoil";
import { mobileMenuAtom } from "../atoms/mobileMenuAtom";
import { useTheme } from "../hooks/useTheme"; // Or access theme from atom

function MobileDrawer({ navItems }) {
  const [isMenuOpen, setIsMenuOpen] = useRecoilState(mobileMenuAtom);

  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          // Theme support
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-r dark:border-gray-700"
        }`}
      >
        {/* Close button */}
        <div className="p-4 border-b dark:border-gray-700">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="p-4">
          {navItems}
        </nav>
      </div>
    </>
  );
}

export default MobileDrawer;
