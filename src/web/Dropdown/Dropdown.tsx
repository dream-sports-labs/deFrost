// src/GenericDropdown.js
import React, { useState } from 'react';
import './Dropdown.css';

type DropdownType = {
  options: string[];
  onSelect: (value: string) => void;
  placeholder: string;
};

const Dropdown = ({ options, onSelect, placeholder }: DropdownType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedOption || placeholder}
        <span>▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option: string, index: number) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
