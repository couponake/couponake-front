'use client';
import { useEffect, useState } from "react";


export default function useDetectMobile() {
  const [isSmall, setIsSmall] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return; 
    
    const checkScreen = () => setIsSmall(window.innerWidth < 660);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isSmall;
}