import { MotiView } from "moti";
import type { ReactNode } from "react";

interface FadeProps {
  children?: ReactNode;
  position?: number;
  //   transition?: MotiTransitionProp;
  delay?: number;
}
const Fade = ({ delay, children, position: top = 100 }: FadeProps) => {
  return (
    <MotiView
      animate={{ top: 0, opacity: 1 }}
      from={{ top, opacity: 0 }}
      transition={{
        damping: 25,
        mass: 2
      }}
      delay={delay}
    >
      {children}
    </MotiView>
  );
};

export default Fade;
