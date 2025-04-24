// src/components/Dropdown.tsx
import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface DropdownProps {
  main: ReactNode; // The clickable trigger (image, div, button, etc.)
  actions: ReactNode[]; // The dropdown items (could be buttons, links, etc.)
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
      {/* Trigger (main) */}
      <div onClick={toggleDropdown} className="dropdown-trigger" style={{ cursor: 'pointer' }}>
        {main}
      </div>

      {/* Dropdown menu */}
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
