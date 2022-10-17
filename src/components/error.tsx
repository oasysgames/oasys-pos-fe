type Props = {
  text: string;
};

export const ErrorMsg = (props: Props) =>  {
  const {
    text
  } = props;

  return (
    <div>
      <p className="text-red-600">{ text }</p>
    </div>
  );
};
