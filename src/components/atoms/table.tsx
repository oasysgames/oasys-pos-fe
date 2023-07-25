import { ReactNode } from "react";
import clsx from 'clsx';

type Head = string;
type Record = string[];

type Props = {
  heads: Head[];
  records: Record[];
  className?: string;
};

export const Table = (props: Props) =>  {
  const {
    heads,
    records,
    className,
  } = props;

  return (
    <div style={{ maxHeight: 'calc(2.5rem * 10)', overflow: 'auto' }}>
      <table className={clsx(
        className,
        "border-collapse w-full overflow-x-auto",
      )}>
        <thead>
          <tr className='bg-green-500 text-white'>
            {heads.map((head, index) => {
              return (
                <th 
                  key={index} 
                  className="border px-4 py-2 text-left font-bold">
                    {head}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            return (
              <tr key={index} className="bg-green-200">
                {record.map((data, dataIndex) => {
                  return (
                    <td key={dataIndex} className="border px-4 py-2 text-left text-sm font-normal">{data}</td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};
