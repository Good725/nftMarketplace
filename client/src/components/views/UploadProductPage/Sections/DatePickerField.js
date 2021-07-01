import React from 'react';
import { useField, useFormikContext } from 'formik';
import DateTimePicker from 'react-datetime-picker';

export const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <DateTimePicker
      {...field}
      {...props}
      maxDate={props.max}
      minDate={props.min}
      disableClock={true}
      selected={(field.value && new Date(field.value)) || null}
      onChange={(val) => {
        setFieldValue(field.name, val);
      }}
    />
  );
};
