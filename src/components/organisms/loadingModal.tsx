import clsx from 'clsx';

type Props = {
  className?: string;
};

export const LoadingModal = (props: Props) => {
  const {
    className,
  } = props;

  return (
    <div className={clsx(
      className,
    )}>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 w-full h-full bg-black opacity-40"
        />
        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative w-full max-w-4xl p-4 mx-auto bg-green-100 rounded-md shadow-lg space-y-8 text-center">
            Loading...
          </div>
        </div>
      </div>
    </div> 
  )
};
