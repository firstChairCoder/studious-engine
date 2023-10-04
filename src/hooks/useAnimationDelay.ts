import { useEffect, useState } from "react";

export default function useAnimationDelay(length: number) {
  const [delay, setdelay] = useState(120);
  useEffect(() => {
    setTimeout(() => {
      setdelay(0);
    }, length * 120);
  }, []);

  return delay;
}
