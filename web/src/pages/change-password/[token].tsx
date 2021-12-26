import { Box, Button } from '@chakra-ui/react';
import { InputField } from 'components/InputField';
import { Wrapper } from 'components/Wrapper';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router from 'next/router';
import login from 'pages/login';
import React from 'react';
import { toErrorMap } from 'utils/toErrorMap';

interface Props {}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  // const [,] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          // const response = await login(values);
          // console.log(response);
          // if (response.data?.login?.errors) {
          //   setErrors(toErrorMap(response.data.login.errors));
          // } else if (response.data?.login.user) {
          //   // worked
          //   router.push("/");
          // }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />

            <Button
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              type="submit"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};
export default ChangePassword;
