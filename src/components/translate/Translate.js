import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import './Translate.css';

const axios = require('axios');

const Translate = ({
  newNoun,
  setNewNoun,
  currentNoun,
  setCurrentNoun,
  isEditing,
}) => {
  const [stringToTranslate, setStringToTranslate] = useState('');
  const [translatedString, setTranslatedString] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('pl');

  const handleTranslation = (event) => {
    event.preventDefault();
    setIsFetching(true);

    const options = {
      method: 'POST',
      url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
      params: {
        'api-version': '3.0',
        'to[0]': `${translationLanguage}`,
        textType: 'plain',
        profanityAction: 'NoAction',
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key,
        'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host,
      },

      data: `[{"Text":"${stringToTranslate}"}]`,
    };

    axios
      .request(options)
      .then(function (response) {
        setTranslatedString(response.data[0].translations[0].text);
        setStringToTranslate('');
        setIsFetching(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleChangeTranslationField = (event) => {
    const { value } = event.target;
    setStringToTranslate(value);
  };

  const concatenateTranslatedString = (translatedString) => {
    if (!isEditing) {
      let concatString = newNoun.notes + '\n';
      concatString += translatedString;
      setNewNoun({ ...newNoun, notes: concatString });
    }

    if (isEditing) {
      setCurrentNoun({ ...currentNoun, notes: '' });
      let concatString = currentNoun.notes + '\n';
      concatString += translatedString;

      setCurrentNoun({ ...currentNoun, notes: concatString });
    }
  };

  return (
    <>
      <ChakraProvider>
        <div className='noun-translate-wrapper'>
          <div className='noun-text-to-translate'>
            <label htmlFor='english'>English to translate</label>
            <textarea
              onChange={handleChangeTranslationField}
              placeholder='Tekst do przetłumaczenia'
              name='english'
              value={stringToTranslate}
              fontFamily='Work sans'
              fontSize='28px'
            ></textarea>
          </div>
          <div className='noun-translation-button'>
            <Button
              colorScheme='blue'
              marginRight={16}
              border={'2px solid black'}
              size='sm'
              margin={2}
              onClick={handleTranslation}
            >
              Translate
            </Button>

            <Button
              colorScheme='blue'
              border={'2px solid black'}
              size='sm'
              margin={2}
              type='button'
              onClick={() => concatenateTranslatedString(translatedString)}
            >
              Add to notes
            </Button>
          </div>
          <div className='noun-translated-text'>
            <label htmlFor='polish'>Polish translation</label>
            <textarea
              name='polish'
              placeholder='Przetłumaczony tekst'
              fontFamily='Work sans'
              defaultValue={translatedString}
              fontSize='28px'
            ></textarea>
          </div>
        </div>
      </ChakraProvider>
    </>
  );
};

export default Translate;
