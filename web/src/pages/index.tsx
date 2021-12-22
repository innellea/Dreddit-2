import { Box } from "@chakra-ui/react";

import CTASection from "components/CTASection";
import SomeImage from "components/SomeImage";
import SomeText from "components/SomeText";
import { usePostsQuery } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";

const Home = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Box mb={8} w="full">
      <SomeText />

      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
      <SomeImage />
      <CTASection />
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
