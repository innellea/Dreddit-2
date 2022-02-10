import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { FaTrashAlt } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          ml={"auto"}
          variant={"ghost"}
          colorScheme={"blue"}
          icon={<MdModeEdit />}
          aria-label={"edit"}
        ></IconButton>
      </NextLink>
      <IconButton
        ml={"auto"}
        variant={"ghost"}
        colorScheme={"red"}
        icon={<FaTrashAlt />}
        aria-label={"delete"}
        onClick={() => {
          deletePost({ id });
        }}
      ></IconButton>
    </Box>
  );
};
