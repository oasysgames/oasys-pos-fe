import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '@/components/atoms';
import { BuildVerseModal } from '../organisms';

type Props = {
  className?: string;
};

export const BuildVerse = (props: Props) => {
  const { className } = props;

  const [buildModalOpen, setBuildModalOpen] = useState(false);

  return (
    <div className={clsx(className)}>
      {buildModalOpen && <BuildVerseModal setModalState={setBuildModalOpen} />}
      <p>Build Verse v1</p>
      <Button
        handleClick={() => {
          setBuildModalOpen(true);
        }}
      >
        Continue Building Verse
      </Button>
    </div>
  );
};
