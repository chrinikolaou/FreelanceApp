// src/components/Dropdown.tsx
import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface DropdownProps {
  main: ReactNode; // The clickable trigger
  actions: ReactNode[]; // The dropdown items 
}

const Dropdown: React.FC<DropdownProps> = ({ main, actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="dropdown-trigger" style={{ cursor: 'pointer' }}>
        {main}
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          {actions.map((action, index) => (
            <div key={index} className="dropdown-item">
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
