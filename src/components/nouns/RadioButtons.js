import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './RadioButtons.css';

function RadioButtons({ selectedCategory, setSelectedCategory, allNounsById }) {
  const categories = allNounsById
    .map((item) => item.category)
    .filter((category, index, self) => self.indexOf(category) === index);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <div className='noun-radio-buttons'>
        <input
          key={uuidv4()}
          type='radio'
          value={'All nouns'}
          checked={selectedCategory === 'All nouns'}
          onChange={handleChange}
          className='noun-category-input'
        />
        <span>{'All'}</span>
      </div>

      {categories.map((category) => (
        <div key={category} className='noun-radio-buttons'>
          <input
            key={uuidv4()}
            type='radio'
            value={category}
            checked={selectedCategory === category}
            onChange={handleChange}
            className='noun-category-input'
          />
          <span>{category}</span>
        </div>
      ))}
    </div>
  );
}

export default RadioButtons;
