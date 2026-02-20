import { useRecoilValue } from "recoil";
import { themeAtom } from "../atoms/themeAtom";

export const useTheme = () => {
  const theme = useRecoilValue(themeAtom);
  return {
    isDarkMode: theme === "dark",
    isLightMode: theme === "light",
    theme,
  };
};
