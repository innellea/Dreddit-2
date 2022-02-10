import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
import { Heading, Box } from "@chakra-ui/react";
import { useGetPostFromUrl } from "utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "components/EditDeletePostButtons";

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

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
      <Box mb={4}>{data.post.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
