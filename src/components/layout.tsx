import { ReactNode } from "react";

type Props = {
  children: ReactNode
};

export const Layout = (props: Props) => {

  return (
    <div className='bg-green-100'>{props.children}</div>
  );
};
