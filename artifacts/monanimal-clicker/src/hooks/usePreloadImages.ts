import { useEffect } from "react";
import { ENVIRONMENTS_PC, ENVIRONMENTS_MOBILE, CHARACTERS } from "@/assets/index";

const ALL_IMAGES = [
  ...Object.values(ENVIRONMENTS_PC),
  ...Object.values(ENVIRONMENTS_MOBILE),
  ...Object.values(CHARACTERS),
];

export function usePreloadImages() {
  useEffect(() => {
    ALL_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);
}
