type Props = {
  text: string;
};

export const SuccessMsg = (props: Props) =>  {
  const {
    text
  } = props;

  return (
    <div>
      <p className="text-green-600">{ text }</p>
    </div>
  );
};
