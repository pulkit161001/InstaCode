import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import PropTypes from "prop-types";
import { mobileMenuAtom } from "../atoms/mobileMenuAtom";

function MobileDrawer({ navigationItems }) {
  const [isMenuOpen, setIsMenuOpen] = useRecoilState(mobileMenuAtom);

  // Filter items that have paths (exclude special items like "Search" and "More")
  const mainNavItems = navigationItems?.filter(item => item.path !== null) || [];

  // Escape key support
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="navigation"
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 left-0 h-screen w-64 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-r dark:border-gray-700"
        }`}
      >
        {/* Close button */}
        <div className="p-4 border-b dark:border-gray-700">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
        <nav className="p-4 flex flex-col gap-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

MobileDrawer.propTypes = {
  navigationItems: PropTypes.array.isRequired,
};

export default MobileDrawer;
