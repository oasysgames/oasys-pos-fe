import { ReactNode } from "react";
import { Sidebar } from '../organisms';

type Props = {
  children: ReactNode
};

type ContainerProps = {
  children: ReactNode
};

const Container = (props: ContainerProps) => {
  return (
    <main className='col-span-9 container mt-40 md:mt-80'>
      {props.children}
    </main>
  );
};

export const Layout = (props: Props) => {

  return (
    <div className='min-h-screen bg-green-100 grid grid-cols-10'>
      <Sidebar className="col-span-1 container"></Sidebar>
      <Container>{props.children}</Container>
    </div>
  );
};
