import React, { useState } from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: beige;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #1c260d;
  color: white;
  outline: none;
  width: 200px;
`;

const OPTIONS = {
  0: 'Легкий',
  1: 'Средний',
  2: 'Сложный',
};

const DifficultySelect = () => {
  const [selectedValue, setSelectedValue] = useState<number>(Number(localStorage.getItem('difficulty')) || 0);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    localStorage.setItem('difficulty', e.target.value);
  };

  return (
    <SelectWrapper>
      <Select
        value={selectedValue}
        onChange={handleSelectChange}
      >
        {Object.entries(OPTIONS).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </Select>
    </SelectWrapper>
  );
};

export default DifficultySelect;
