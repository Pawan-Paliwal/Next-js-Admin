"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const usePathChange = (callback) => {
  const pathName = usePathname();

  useEffect(() => {
    callback();
  }, [pathName]);

  return;
};

export default usePathChange;
