import { ChangeEvent } from "react";
import clsx from 'clsx';

type Props = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  handleClick: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputType?: InputType;
};

export enum InputType {
  Text = "text",
  Password = "password",
  Email = "email",
  Number = "number",
  Checkbox = "checkbox",
  Radio = "radio",
  File = "file",
  Submit = "submit",
  Button = "button",
  Date = "date",
  Time = "time",
  DateTimeLocal = "datetime-local",
  Month = "month",
  Week = "week",
  Color = "color",
  Range = "range",
  Tel = "tel",
  Url = "url"
}

export const Input = (props: Props) =>  {
  const {
    value,
    placeholder,
    disabled,
    handleClick,
    className,
  } = props;

  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={handleClick}
      disabled={disabled}
      className={clsx(
        className,
        'border',
        'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-4 focus:outline-green-500 focus:shadow-outline',
      )}
      type={props.inputType || InputType.Text}
    />
  );
};
