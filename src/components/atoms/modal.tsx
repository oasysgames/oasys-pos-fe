import { ReactNode, SetStateAction } from "react";
import clsx from 'clsx';
import { Button } from ".";

type Props = {
  className?: string;
  children: ReactNode;
  setModalState: (value: SetStateAction<boolean>) => void;
};

export const Modal = (props: Props) => {
  const {
    className,
    children,
    setModalState,
  } = props;

  const closeModal = () => {
    setModalState(false);
  }

  return (
    <div className={clsx(
      className,
    )}>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 w-full h-full bg-black opacity-40"
          onClick={closeModal}
        />
        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative w-full max-w-4xl p-4 mx-auto bg-green-100 rounded-md shadow-lg space-y-8">
            <Button
              handleClick={closeModal}
              className='absolute top-0 right-0 p-2 text-sm'
            >
            X
            </Button>
            {children}
          </div>
        </div>
      </div>
    </div> 
  );
};
