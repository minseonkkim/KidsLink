import React, { useState } from 'react';

interface ChildNameProps {
  child: { name: string } | null;
}

const ChildName: React.FC<ChildNameProps> = ({ child }) => {
  const [name, setName] = useState(child ? child.name : '');

  return (
    <span
      className={`${
        child ? 'bg-[#8CAD1E] text-[#fff]' : 'bg-[#EAEAEA] text-[#363636]'
      } cursor-pointer flex items-center justify-center rounded-[30px] w-[95px] h-[45px] font-bold mx-3 my-2 text-[17px]`}
    >
      {child ? name : '분류실패'}
    </span>
  );
};

export default ChildName;
