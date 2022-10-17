type Props = {
  text: string;
};

export const ErrorMsg = (props: Props) =>  {
  const {
    text
  } = props;

  return (
    <div>
      <p>{ text }</p>
    </div>
  );
};
