import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { useMeQuery } from "generated/graphql";
import NextLink from "next/link";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {}
export const Header: React.FC<HeaderProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <Flex>
        <NextLink href="/login">
          <Link m={3}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link m={3}>Register</Link>
        </NextLink>
      </Flex>
    );
  }
  // user logged in
  else {
    body = (
      <Flex>
        <Box>Hello, {data.me.username}</Box>
        <Button ml={3} variant="link">
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex as="header" width="full" align="center">
      <Heading as="h1" size="md">
        <Link href="/">Dreddit</Link>
      </Heading>
      <Box>{body}</Box>
      <Box marginLeft="auto">
        <ThemeToggle />
      </Box>
    </Flex>
  );
};
