import React, { useState, useMemo, useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '@mui/material';
import { Button } from '../button/Button.js';
import RadioButtons from './RadioButtons.js';
import Atom from '../spinner/Atom.js';
import NounsForm from './NounsForm.js';
import './Nouns.css';
import { dummyNounData } from '../../utils/dummyNounData.js';

const Nouns = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [nounsToRender, setNounsToRender] = useState([]);
  const [allNounsById, setAllNounsById] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('');

  let [count, setCount] = useState(1);
  const [deleteNoun, setDeleteNoun] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoun, setCurrentNoun] = useState({});

  const loadDummyData = async () => {
    if (!isAuthenticated) {
      setIsLoading(true);
      setSelectedCategory('All nouns');
      setAllNounsById(dummyNounData);
      setNounsToRender(dummyNounData);
    }
    setIsLoading(false);
    return;
  };

  useEffect(() => {
    loadDummyData();
    // eslint-disable-next-line
  }, []);

  const getFromExpressApp = async (signal) => {
    try {
      setIsLoading(true);

      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/nouns/${user.sub}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const returnFromGetRequest = await response.json();
      let dataToRender = returnFromGetRequest.data;

      setNounsToRender(dataToRender);
      setAllNounsById(dataToRender);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request was cancelled');
      } else if (error.status >= 400 && error.status < 600) {
        console.error(`Error: ${error.status} - ${error.message}`);
      } else {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const controller = new AbortController();
      const signal = controller.signal;

      getFromExpressApp(signal);

      return () => controller.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDetails = (index) => {
    if (activeIndex === index) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(index);
    }
  };

  const onDelete = async (id) => {
    try {
      const token = await getAccessTokenSilently();

      const controller = new AbortController();
      const { signal } = controller;

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/nouns/noun/${user.sub}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
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
    } finally {
      setDeleteNoun(false);
    }
    getFromExpressApp();
  };

  const onCancelDelete = () => {
    setCount((count = count + 1));
    setDeleteNoun(false);
  };

  const onConfirmDelete = (item) => {
    setCount((count = count + 1));
    onDelete(item.id);
  };

  const onPrepareToDelete = () => {
    setCount((count = count + 1));
    setDeleteNoun(true);
  };

  const editNoun = (nounInList) => {
    setOpen(true);
    setIsEditing(true);
    setCurrentNoun(nounInList);
  };

  const filterNounsByCategory = (category) => {
    if (category === 'All nouns') {
      setNounsToRender(allNounsById);
      return;
    }
    const filterNounsByCategory = allNounsById.filter(
      (el) => el.category === category
    );
    setNounsToRender(filterNounsByCategory);
  };

  useEffect(() => {
    filterNounsByCategory(selectedCategory);
    // eslint-disable-next-line
  }, [selectedCategory]);

  const loadingIndicator = useMemo(() => {
    return (
      isLoading && <Atom size='200' color='#54a8f1' animationDuration='700' />
    );
  }, [isLoading]);

  const nounListItems = useMemo(() => {
    return nounsToRender.map((item, index) => {
      return (
        <li className='list-item-nouns' key={uuidv4()}>
          <img
            className='noun-image-to-display'
            src={item.image_url}
            alt={item.polish_word}
            onClick={() => toggleDetails(index)}
            style={{ display: activeIndex === index ? 'none' : 'block' }}
          />
          {activeIndex === index && (
            <div
              // onClick={() => toggleDetails(index)}
              className='noun-description'
            >
              <div onClick={() => toggleDetails(index)} className='toggle'>
                <div className='wrapper-noun-description'>
                  <p className='polish-english-word'>
                    {item.polish_word} &rarr; {item.english_word}
                  </p>

                  <p className='short-sentence'>{item.notes}</p>
                </div>
              </div>
              <div className='noun-buttons'>
                {!deleteNoun ? (
                  <Button
                    buttonStyle='btn-delete-noun'
                    onClick={onPrepareToDelete}
                  >
                    Delete
                  </Button>
                ) : (
                  <>
                    <Button
                      buttonStyle='btn-delete-noun'
                      onClick={onCancelDelete}
                    >
                      Cancel
                    </Button>

                    <Button
                      buttonStyle='btn-delete-noun'
                      onClick={() => onConfirmDelete(item)}
                    >
                      Confirm
                    </Button>
                  </>
                )}
                {!deleteNoun && (
                  <Button
                    buttonStyle='btn-edit-noun'
                    onClick={() => editNoun(item)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          )}
        </li>
      );
    });
    // eslint-disable-next-line
  }, [nounsToRender, activeIndex, count]);

  return (
    <>
      {isAuthenticated && (
        <>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby='parent-modal-title'
            aria-describedby='parent-modal-description'
          >
            <div>
              <NounsForm
                currentNoun={currentNoun}
                setCurrentNoun={setCurrentNoun}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                allNounsById={allNounsById}
                open={open}
                setOpen={setOpen}
                getFromExpressApp={getFromExpressApp}
              />
            </div>
          </Modal>
          <div className='add-noun-button-wrapper'>
            <Button
              buttonStyle='btn-add-noun'
              buttonSize='btn--medium'
              onClick={() => setOpen(true)}
            >
              Add Noun
            </Button>
          </div>
        </>
      )}

      {!isAuthenticated && (
        <div className='log-in-prompt-nouns'>
          <p>Log for interactive experience</p>
        </div>
      )}
      {loadingIndicator}
      <div className='wrapper-list-buttons'>
        <div className='wrapper-image-list'>
          <ul className='unordered-list-nouns'>{nounListItems}</ul>
        </div>

        <div className='wrapper-radio-buttons'>
          <RadioButtons
            allNounsById={allNounsById}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </>
  );
};

export default Nouns;
