import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { useSpeechSynthesis } from 'react-speech-kit';
import TextToSpeech from '../textToSpeech/TextToSpeech';
import { ChakraProvider } from '@chakra-ui/react';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import './Notes.css';

const Notes = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const location = useLocation();
  const { item } = location.state;
  const currentVerbId = item.id;

  const [dataToRender, setDataToRender] = useState(item);
  const [stringToTranslate, setStringToTranslate] = useState('');
  const [translatedString, setTranslatedString] = useState('');
  const { voices } = useSpeechSynthesis();
  const [translationLanguage, setTranslationLanguage] = useState('pl');
  const [isFetching, setIsFetching] = useState(false);
  const [columnsNotes, setColumnsNotes] = useState({});
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const axios = require('axios');

  const putToExpressApp = async () => {
    try {
      const token = await getAccessTokenSilently();

      await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/kanban/${user.sub}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(columnsNotes),
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const getFromExpressApp = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/kanban/${user?.sub}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (user) {
        const returnFromGetRequest = await response.json();
        const kanbanObject = returnFromGetRequest.data?.kanbanObject;

        setColumnsNotes(kanbanObject);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getFromExpressApp();
  }, []);

  const addTranslationToNotes = async (event) => {
    event.preventDefault();

    let dataToRenderCurrentVerb;

    const columnClone = Object.assign({}, columnsNotes);

    columnClone.column_D.items.forEach((el) => {
      if (el.id === currentVerbId) {
        dataToRenderCurrentVerb = el;
        el.notes = `${el.notes}${'\n'}${translatedString}`;
      } else {
        return el;
      }
    });

    setColumnsNotes(columnClone);

    await putToExpressApp();
    await getFromExpressApp();

    setDataToRender(dataToRenderCurrentVerb);

    setStringToTranslate('');
    setTranslatedString('');
  };

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

  const handleChangeTextField = async (event) => {
    const { name, value } = event.target;

    setIsEditingNotes(true);

    setDataToRender({
      ...dataToRender,
      [name]: value,
    });
  };

  const handleUpdateNotes = async () => {
    const columnClone = Object.assign({}, columnsNotes);

    columnClone.column_D.items.forEach((el) => {
      if (el.id === currentVerbId) {
        el.notes = `${dataToRender.notes}`;
      } else {
        return el;
      }
    });

    setColumnsNotes(columnClone);
    await putToExpressApp();
    setIsEditingNotes(false);
  };

  return (
    <>
      <ChakraProvider>
        <div className='notes-wrapper'>
          <Box w='100%' h='250px' p={4}>
            <Tabs isFitted variant='soft-rounded'>
              <TabList mb='1em'>
                <Tab>Present Tense</Tab>
                <Tab>Past Masculine</Tab>
                <Tab>Past Feminine</Tab>
              </TabList>
              <TabList mb='1em'>
                <Tab>Future Masculine</Tab>
                <Tab>Future Feminine</Tab>
                <Tab>Future Imperfect</Tab>
              </TabList>
              <TabList mb='1em'>
                <Tab>Conditional Masculine</Tab>
                <Tab>Conditional Feminine</Tab>
                <Tab>Imperative</Tab>
              </TabList>
              <TabPanels>
                <TabPanel padding={0}>
                  <div className='wrapper-present'>
                    <ul className='polish-word-list'>
                      <li>{dataToRender.present.present_ja}</li>
                      <li>{dataToRender.present.present_ty}</li>
                      <li>{dataToRender.present.present_on_ona_ono}</li>
                      <li>{dataToRender.present.present_my}</li>
                      <li>{dataToRender.present.present_wy}</li>
                      <li>{dataToRender.present.present_oni_one}</li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-past-masculine'>
                    <ul className='polish-word-list'>
                      <li> {dataToRender.past.past_ja_masc}</li>
                      <li> {dataToRender.past.past_ty_masc}</li>
                      <li> {dataToRender.past.past_on_masc}</li>
                      <li> {dataToRender.past.past_my_masc}</li>
                      <li>{dataToRender.past.past_wy_masc}</li>
                      <li> {dataToRender.past.past_oni_masc}</li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-past-feminine'>
                    <ul className='polish-word-list'>
                      <li> {dataToRender.past.past_ja_fem}</li>
                      <li>{dataToRender.past.past_ty_fem}</li>
                      <li> {dataToRender.past.past_ona_fem}</li>
                      <li> {dataToRender.past.past_my_fem}</li>
                      <li> {dataToRender.past.past_wy_fem}</li>
                      <li> {dataToRender.past.past_one_fem}</li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-future-masculine'>
                    <ul className='polish-word-list'>
                      <li> {dataToRender.future_masc.future_masc_ja} </li>
                      <li>{dataToRender.future_masc.future_masc_ty}</li>
                      <li> {dataToRender.future_masc.future_masc_on}</li>
                      <li> {dataToRender.future_masc.future_masc_my}</li>
                      <li> {dataToRender.future_masc.future_masc_wy} </li>
                      <li> {dataToRender.future_masc.future_masc_oni}</li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-future-feminine'>
                    <ul className='polish-word-list'>
                      <li> {dataToRender.future_fem.future_fem_ja} </li>
                      <li>{dataToRender.future_fem.future_fem_ty}</li>
                      <li> {dataToRender.future_fem.future_fem_ona}</li>
                      <li> {dataToRender.future_fem.future_fem_my} </li>
                      <li> {dataToRender.future_fem.future_fem_wy}</li>
                      <li> {dataToRender.future_fem.future_fem_one} </li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-future-imperfect'>
                    <ul className='polish-word-list'>
                      <li>{dataToRender.imp_future.imp_future_ja} </li>
                      <li>{dataToRender.imp_future.imp_future_ty}</li>
                      <li>{dataToRender.imp_future.imp_future_on_ona_ono} </li>
                      <li>{dataToRender.imp_future.imp_future_my} </li>
                      <li>{dataToRender.imp_future.imp_future_wy} </li>
                      <li>{dataToRender.imp_future.imp_future_oni_one} </li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-conditional-masculine'>
                    <ul className='polish-word-list'>
                      <li>
                        {
                          dataToRender.conditional_masculine
                            .conditional_masculine_ja
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_masculine
                            .conditional_masculine_ty
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_masculine
                            .conditional_masculine_on
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_masculine
                            .conditional_masculine_my
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_masculine
                            .conditional_masculine_wy
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_masculine
                            .conditional_masculine_oni
                        }
                      </li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-conditional-feminine'>
                    <ul className='polish-word-list'>
                      <li>
                        {
                          dataToRender.conditional_feminine
                            .conditional_feminine_ja
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_feminine
                            .conditional_feminine_ty
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_feminine
                            .conditional_feminine_ona
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_feminine
                            .conditional_feminine_my
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_feminine
                            .conditional_feminine_wy
                        }
                      </li>
                      <li>
                        {
                          dataToRender.conditional_feminine
                            .conditional_feminine_one
                        }
                      </li>
                    </ul>
                  </div>
                </TabPanel>
                <TabPanel padding={0}>
                  <div className='wrapper-imperative'>
                    <ul className='polish-word-list'>
                      <li>{dataToRender.imperative.imperative_ja} </li>
                      <li>{dataToRender.imperative.imperative_ty}</li>
                      <li>{dataToRender.imperative.imperative_on_ona_oni} </li>
                      <li>{dataToRender.imperative.imperative_my} </li>
                      <li>{dataToRender.imperative.imperative_wy} </li>
                      <li>{dataToRender.imperative.imperative_oni} </li>
                    </ul>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          <div className='user-notes-input'>
            <form>
              <div className='translation'>
                <div className='card-button-wrapper'>
                  <div className='card-image-notes'>
                    {dataToRender.word_image.image_url && (
                      <img
                        src={dataToRender.word_image.image_url}
                        alt='img'
                        height='150'
                        width='125'
                      />
                    )}
                  </div>
                </div>

                <div className='text-to-translate'>
                  <textarea
                    onChange={handleChangeTranslationField}
                    placeholder='Tekst do przetłumaczenia'
                    name='english'
                    value={stringToTranslate}
                    fontFamily='Work sans'
                    fontSize='28px'
                  ></textarea>
                </div>

                <div className='translation-radio-buttons'>
                  <RadioGroup
                    onChange={setTranslationLanguage}
                    value={translationLanguage}
                  >
                    <Stack direction='column'>
                      <Radio
                        defaultChecked={true}
                        colorScheme={'whatsapp'}
                        id='eng-pl'
                        name='eng-pl'
                        value={'pl'}
                      >
                        Eng-Pol
                      </Radio>
                      <Radio
                        colorScheme={'whatsapp'}
                        id='pl-eng'
                        name='pl-eng'
                        value={'en'}
                      >
                        Pol-Eng
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <div className='spinner'>{isFetching && <Spinner />}</div>
                  <div className='translation-button'>
                    <Button
                      colorScheme='blue'
                      border={'2px solid black'}
                      size='sm'
                      onClick={handleTranslation}
                    >
                      Translate
                    </Button>
                  </div>
                  <div className='add-to-notes-button'>
                    <Button
                      colorScheme='blue'
                      border={'2px solid black'}
                      size='sm'
                      id='submit-verb-button'
                      type='submit'
                      onClick={addTranslationToNotes}
                    >
                      Add to notes
                    </Button>
                  </div>
                </div>

                <div className='translated-text'>
                  <textarea
                    name='polish'
                    placeholder='Przetłumaczony tekst'
                    fontFamily='Work sans'
                    defaultValue={translatedString}
                    fontSize='28px'
                  ></textarea>
                </div>

                <textarea
                  className='user-notes'
                  fontFamily='Work sans'
                  fontSize='28px'
                  id='notes'
                  name='notes'
                  rows='4'
                  cols='25'
                  value={dataToRender.notes}
                  onChange={handleChangeTextField}
                ></textarea>
              </div>
              <div className='voice-player-and-edit-button'>
                <div className='voice-player'>
                  <TextToSpeech data={dataToRender.notes} voices={voices} />
                </div>
                <div className='edit-notes-button'>
                  <Button
                    colorScheme={isEditingNotes ? 'red' : 'green'}
                    border={'2px solid black'}
                    size='sm'
                    onClick={handleUpdateNotes}
                  >
                    {isEditingNotes ? 'Update Notes' : 'Edit Notes'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ChakraProvider>
    </>
  );
};

export default Notes;
