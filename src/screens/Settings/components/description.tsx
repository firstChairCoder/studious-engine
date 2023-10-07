import { Text } from "native-base";
import type { PropsWithChildren } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
const Description = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Text color="em.3" fontSize="md">
      {children}
    </Text>
  );
};

export default Description;
