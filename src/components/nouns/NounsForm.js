import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../button/Button.js';
import Translate from '../translate/Translate.js';
import './NounsForm.css';
import ShutterStock from '../shutter-stock/ShutterStock.js';

const initialNounFormData = {
  category: '',
  polish_word: '',
  english_word: '',
  image_url: '',
  notes: '',
};

const NounsForm = ({
  currentNoun,
  setCurrentNoun,
  isEditing,
  setIsEditing,
  allNounsById,
  setOpen,
  getFromExpressApp,
}) => {
  const [newNoun, setNewNoun] = useState({ ...initialNounFormData });

  const categories = allNounsById
    .map((item) => item.category)
    .filter((category, index, self) => self.indexOf(category) === index);

  const { user, getAccessTokenSilently } = useAuth0();

  const inputRef = useRef();

  const focusOnNounEntry = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    focusOnNounEntry();
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    if (isEditing) {
      setCurrentNoun((previous) => ({
        ...previous,
        [name]: value,
      }));
    } else {
      setNewNoun({ ...newNoun, [name]: value });
    }
  };

  const putToExpressApp = async (noun) => {
    try {
      const token = await getAccessTokenSilently();

      const controller = new AbortController();
      const { signal } = controller;

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/nouns/noun/${user.sub}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(noun),
          signal,
        }
      );

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request was cancelled');
      } else if (error.status >= 400 && error.status < 600) {
        console.error(`Error: ${error.status} - ${error.message}`);
      } else {
        console.error(error.message);
      }
    }
  };

  const postToExpressApp = async (noun) => {
    try {
      const token = await getAccessTokenSilently();

      const controller = new AbortController();
      const { signal } = controller;

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/nouns/${user.sub}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(noun),
          signal,
        }
      );
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request was cancelled');
      } else if (error.status >= 400 && error.status < 600) {
        console.error(`Error: ${error.status} - ${error.message}`);
      } else {
        console.error(error.message);
      }
    }
  };

  const createNewNoun = async () => {
    setOpen(false);
    await postToExpressApp(newNoun);
    setNewNoun({ ...initialNounFormData });
    getFromExpressApp();
  };

  const updateNoun = async () => {
    setOpen(false);
    await putToExpressApp(currentNoun);
    await getFromExpressApp();
    setIsEditing(false);
  };

  return (
    <>
      <div className='form-wrapper'>
        <form onSubmit={createNewNoun}>
          <div className='noun-form-input-wrapper'>
            {isEditing && (
              <div className='close-modal-button'>
                <Button
                  buttonStyle='btn--add-new-verb'
                  buttonSize='btn--medium'
                  onClick={updateNoun}
                >
                  {isEditing ? 'Update Noun' : 'Editing'}
                </Button>
              </div>
            )}
            <div className='noun-form-input-category'>
              <label htmlFor='category'>Category</label>
              <select
                name='category'
                defaultValue={
                  isEditing ? currentNoun.category : newNoun.category
                }
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className='noun-form-input-new-category'>
              <label htmlFor='newCategory'>New Category</label>
              <input
                type='text'
                name='category'
                defaultValue={
                  isEditing ? currentNoun.category : newNoun.category
                }
                onChange={handleChange}
              />
            </div>
            <div className='noun-form-input-english-word'>
              <label htmlFor='english_word'>English</label>
              <input
                placeholder='English'
                id='english_word'
                type='text'
                name='english_word'
                required
                onChange={handleChange}
                defaultValue={
                  isEditing ? currentNoun.english_word : newNoun.word
                }
              />
            </div>
            <div className='noun-form-input-polish-word'>
              <label htmlFor='polish_word'>Polish</label>
              <input
                ref={inputRef}
                placeholder='Polish'
                id='polish_word'
                type='text'
                name='polish_word'
                required
                onChange={handleChange}
                defaultValue={
                  isEditing ? currentNoun.polish_word : newNoun.word
                }
              />
            </div>
            <div className='noun-form-input-image'>
              <label htmlFor='image_url'>Image URL</label>
              <input
                placeholder='Image URL'
                id='image_url'
                type='text'
                name='image_url'
                required
                onChange={handleChange}
                defaultValue={
                  isEditing ? currentNoun.image_url : newNoun.image_url
                }
              />
            </div>
            <div className='translation-component'>
              <Translate
                newNoun={newNoun}
                setNewNoun={setNewNoun}
                currentNoun={currentNoun}
                setCurrentNoun={setCurrentNoun}
                isEditing={isEditing}
              />
            </div>
            <div className='noun-form-input-notes'>
              <label htmlFor='notes'>Your notes</label>
              <textarea
                id='notes'
                name='notes'
                rows='4'
                cols='50'
                placeholder={`Create a few sentences using the noun.`}
                fontFamily='Work sans'
                fontSize='28px'
                onChange={handleChange}
                value={isEditing ? currentNoun.notes : newNoun.notes}
              />
            </div>
            {!isEditing && (
              <div className='create-noun-submit-button'>
                <Button
                  buttonStyle='btn--add-new-verb'
                  buttonSize='btn--medium'
                  id='submit-verb-button'
                  type='submit'
                >
                  Create
                </Button>
              </div>
            )}
          </div>
        </form>

        <div className='shutter-stock-wrapper'>
          <ShutterStock />
        </div>
      </div>
    </>
  );
};

export default NounsForm;
