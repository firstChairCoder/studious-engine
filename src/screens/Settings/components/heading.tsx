import { Text } from "native-base";
import type { PropsWithChildren } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
const Heading = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Text
      letterSpacing="2xl"
      isTruncated
      px="20px"
      mb="2"
      color="em.3"
      fontSize="sm"
      textTransform="uppercase"
    >
      {children}
    </Text>
  );
};

export default Heading;
