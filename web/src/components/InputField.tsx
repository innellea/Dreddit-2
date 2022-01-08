import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { useField } from 'formik';
import React, { ReactElement, InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <div>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name} id="formLabel">
          {label}
        </FormLabel>
        <Input
          {...field}
          {...props}
          id={field.name}
          placeholder={props.placeholder}
        />
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    </div>
  );
};
