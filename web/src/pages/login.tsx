import React, { ReactElement } from "react";
import { Formik, Form, Field } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from "components/Wrapper";
import { InputField } from "components/InputField";
import { useMutation } from "urql";
import { useLoginMutation, useMeQuery } from "generated/graphql";
import { toErrorMap } from "utils/toErrorMap";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
const Login: React.FC<{}> = ({}) => {
  //! TODO: add validation
  const router = useRouter();
  const [, login] = useLoginMutation();
  const [{ data, fetching }] = useMeQuery();
  if (data?.me) {
    router.replace("/");
  }
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          console.log(response);
          if (response.data?.login?.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // worked
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
              autoComplete="username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
            </Box>

            <Box>
              <Flex mt={2}>
                <NextLink href="/forgot-password">
                  <Link ml="auto"> Forgot Password </Link>
                </NextLink>
              </Flex>
            </Box>

            <Button
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
