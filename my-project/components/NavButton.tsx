import React from 'react'

interface Props {
    title: string;
    isActive?: boolean;
    onClick?: () => void;
}

function NavButton({ title, isActive, onClick }: Props) {
  return(
    <button
        onClick={onClick}
        className={`${
            isActive && "bg-[#b030ff]"
        } hover:bg-[#b030ff] text-[#000000] py-2 px-2 rounded font-bold`}
        >
      {title}
    </button>
  );
}

export default NavButton;