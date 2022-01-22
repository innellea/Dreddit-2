import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Heading, Box } from "@chakra-ui/react";
import Layout from "components/layout";
const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return <Box>could not find post</Box>;
  }

  return (
    <>
      <Heading mb={4}>{data.post.title}</Heading>
      {data.post.text}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
