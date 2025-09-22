import clsx from 'clsx';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

import { TextInput, TextInputProps } from '@mantine/core';

// ----------------------------------------------------------------------

export type MInputProps<T extends FieldValues> = TextInputProps & UseControllerProps<T>;

const Input = <T extends FieldValues>(props: MInputProps<T>) => {
  const { name, control, defaultValue, rules, shouldUnregister, className, ...other } = props;

  const { field, fieldState } = useController<T>({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
  });

  return (
    <div className={clsx('', className)}>
      <TextInput
        error={<span className="ErrorInput">{fieldState.error?.message}</span>}
        inputWrapperOrder={['label', 'input', 'description', 'error']}
        {...field}
        {...other}
      />
    </div>
  );
};

export default Input;
