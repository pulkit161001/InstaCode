import { useEffect } from "react";
import { useRecoilState } from "recoil";
import PropTypes from "prop-types";
import { mobileMenuAtom } from "../atoms/mobileMenuAtom";

function MobileDrawer({ navItems }) {
  const [isMenuOpen, setIsMenuOpen] = useRecoilState(mobileMenuAtom);

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
        <nav className="p-4">{navItems}</nav>
      </div>
    </>
  );
}

MobileDrawer.propTypes = {
  navItems: PropTypes.node.isRequired,
};

export default MobileDrawer;
