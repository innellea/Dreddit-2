import { Flex, IconButton } from "@chakra-ui/react";
import {
  PostSnippetFragment,
  PostsQuery,
  useVoteMutation,
} from "generated/graphql";
import React, { Component } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { useState } from "react";
interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();

  return (
    <Flex
      textAlign={"center"}
      paddingRight={5}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
          console.log(post.voteStatus);
        }}
        isLoading={loadingState === "updoot-loading"}
        variant="outline"
        colorScheme={post.voteStatus === 1 ? "teal" : undefined}
        // colorScheme="teal"
        aria-label="upvote"
        fontSize="20px"
        icon={<BiUpvote />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          console.log(post.voteStatus);
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        variant="outline"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        aria-label="Downvote"
        fontSize="20px"
        icon={<BiDownvote />}
      />
    </Flex>
  );
};
