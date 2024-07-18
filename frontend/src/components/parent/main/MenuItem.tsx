import React from 'react';

interface MenuItemProps {
  icon: string;
  text: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text }) => {
  return (
    <div className="menu-item">
      <img src={icon} alt={text} className="w-12 h-12 mb-2" />
      <span>{text}</span>
    </div>
  );
};

export default MenuItem;
