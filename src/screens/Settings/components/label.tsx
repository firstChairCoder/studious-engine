import { Text } from "native-base";
import type { PropsWithChildren } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
const Label = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Text color="em.2" mb="1" fontSize="lg">
      {children}
    </Text>
  );
};

export default Label;
