import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { ReactNode } from "react";
import { createUrqlClient } from "utils/createUrqlClient";

import Footer from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box margin="0 auto" maxWidth={800} transition="0.5s ease-out">
      <Box margin="8">
        <Header />
        <Box as="main" marginY={22}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient)(Layout);
