import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { useLogoutMutation, useMeQuery } from "generated/graphql";
import NextLink from "next/link";
import { isServer } from "utils/isServer";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {}
export const Header: React.FC<HeaderProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;
  console.log(data?.me?.username);
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
      <>
        <Box>Hello, {data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          ml={3}
          variant="link"
        >
          Logout
        </Button>
      </>
    );
  }
  return (
    <Flex as="header" width="full" align="center">
      <Box>
        <ThemeToggle />
      </Box>
      <Heading as="h1" size="md">
        <Link href="/">Dreddit</Link>
      </Heading>

      <Box marginLeft="auto">{body}</Box>
    </Flex>
  );
};
