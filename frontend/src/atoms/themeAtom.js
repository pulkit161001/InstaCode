import { atom } from "recoil";

export const themeAtom = atom({
  key: "theme",
  default: localStorage.getItem("theme") || "light",
  effects: [
    ({ setSelf, onSet }) => {
      // Load from localStorage on initialization
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setSelf(savedTheme);
      }

      // Subscribe to changes and persist to localStorage
      onSet((newTheme) => {
        localStorage.setItem("theme", newTheme);
      });
    },
  ],
});
