import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import CTASection from "components/CTASection";
import SomeImage from "components/SomeImage";
import SomeText from "components/SomeText";
import { useDeletePostMutation, usePostsQuery } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { createUrqlClient } from "utils/createUrqlClient";
import { UpdootSection } from "components/UpdootSection";
import { FaTrashAlt } from "react-icons/fa";
const Home = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  const [, deletePost] = useDeletePostMutation();
  if (!fetching && !data) {
    return <div>query failed for some reason</div>;
  }

  return (
    <Box mb={8} w="full">
      <SomeText />
      <Flex>
        <NextLink href="/create-post">
          <Button fontSize={18} ml="auto" mb={5}>
            Create Post
          </Button>
        </NextLink>
      </Flex>
      <Stack>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          data!.posts.posts.map((p) => (
            <>
              <Flex key={p.id} p={5} shadow="md" borderWidth="2px">
                <UpdootSection post={p}></UpdootSection>
                <Box flex={"1"}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Flex align={"center"}>
                    <Text flex={"1"} mt={4}>
                      {p.textSnippet}...
                    </Text>

                    <IconButton
                      ml={"auto"}
                      variant={"solid"}
                      colorScheme={"red"}
                      icon={<FaTrashAlt />}
                      aria-label={"delete"}
                      onClick={() => {
                        deletePost({ id: p.id });
                      }}
                    ></IconButton>
                  </Flex>
                </Box>
              </Flex>
            </>
          ))
        )}
      </Stack>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={6}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
      <SomeImage />
      <CTASection />
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
