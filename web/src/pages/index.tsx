import { Box } from "@chakra-ui/react";

import CTASection from "components/CTASection";
import SomeImage from "components/SomeImage";
import SomeText from "components/SomeText";
import { usePostsQuery } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
const Home = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Box mb={8} w="full">
      <SomeText />
      <NextLink href="/create-post">
        <Link m={3}>Create Post</Link>
      </NextLink>
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
