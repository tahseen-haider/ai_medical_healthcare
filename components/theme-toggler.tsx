"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggler() {
  const [hasMounted, setHasMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setHasMounted(true)  
    return () => {};
  }, []);

  if (!hasMounted) return;

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full hover:bg-white bg-white w-16 h-8 relative shadow-[inset_0_0px_6px_rgba(0,0,0,0.7)]"
    >
      <div
        className={`w-6 h-6  shadow-[0_0_2px_rgba(0,0,0,1)] rounded-full absolute ${
          resolvedTheme === "light"
            ? "translate-x-4 bg-white"
            : "-translate-x-4 bg-black"
        } flex items-center justify-center transition-transform`}
      >
        <Sun
          className={`absolute text-black transition-opacity duration-300 ${
            resolvedTheme === "light" ? "opacity-100" : "opacity-0"
          }`}
        />
        <Moon
          className={`absolute text-white transition-opacity duration-300 ${
            resolvedTheme === "dark" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </Button>
  );
}
