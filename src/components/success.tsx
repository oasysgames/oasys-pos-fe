type Props = {
  text: string;
};

export const SuccessMsg = (props: Props) =>  {
  const {
    text
  } = props;

  return (
    <div>
      <p>{ text }</p>
    </div>
  );
};
