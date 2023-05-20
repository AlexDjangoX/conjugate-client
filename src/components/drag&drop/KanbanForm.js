import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ShutterStock from '../shutter-stock/ShutterStock.js';
import { Button } from '../button/Button.js';
import { v4 as uuidv4 } from 'uuid';
import './KanbanForm.css';
import { ChakraProvider } from '@chakra-ui/react';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

const initialData = {
  id: uuidv4(),
  notes: '',
  word_image: { polish_word: '', english_word: '', image_url: '' },
  gram_case: {
    case: '',
    aspect: '',
    color: '#ff2233',
  },
  present: {
    present_ja: '',
    present_ty: '',
    present_on_ona_ono: '',
    present_my: '',
    present_wy: '',
    present_oni_one: '',
  },
  past: {
    past_ja_masc: '',
    past_ja_fem: '',
    past_ty_masc: '',
    past_ty_fem: '',
    past_on_masc: '',
    past_ona_fem: '',
    past_my_masc: '',
    past_my_fem: '',
    past_wy_masc: '',
    past_wy_fem: '',
    past_oni_masc: '',
    past_one_fem: '',
  },
  imp_future: {
    imp_future_ja: 'będę ',
    imp_future_ty: 'będziesz ',
    imp_future_on_ona_ono: 'będzie ',
    imp_future_my: 'będziemy ',
    imp_future_wy: 'będziecie ',
    imp_future_oni_one: 'będą ',
  },
  future_fem: {
    future_fem_ja: 'będę ',
    future_fem_ty: 'będziesz ',
    future_fem_ona: 'będzie ',
    future_fem_my: 'będziemy ',
    future_fem_wy: 'będziecie ',
    future_fem_one: 'będą ',
  },
  future_masc: {
    future_masc_ja: 'będę ',
    future_masc_ty: 'będziesz ',
    future_masc_on: 'będzie ',
    future_masc_my: 'będziemy ',
    future_masc_wy: 'będziecie ',
    future_masc_oni: 'będą ',
  },
  conditional_masculine: {
    conditional_masculine_ja: '',
    conditional_masculine_ty: '',
    conditional_masculine_on: '',
    conditional_masculine_my: '',
    conditional_masculine_wy: '',
    conditional_masculine_oni: '',
  },
  conditional_feminine: {
    conditional_feminine_ja: '',
    conditional_feminine_ty: '',
    conditional_feminine_ona: '',
    conditional_feminine_my: '',
    conditional_feminine_wy: '',
    conditional_feminine_one: '',
  },
  imperative: {
    imperative_ja: '',
    imperative_ty: '',
    imperative_on_ona_oni: '',
    imperative_my: '',
    imperative_wy: '',
    imperative_oni: '',
  },
};

const KanbanForm = ({
  setOpen,
  columns,
  currentVerb,
  setCurrentVerb,
  isEditing,
  setIsEditing,
}) => {
  const resetState = Object.assign({}, initialData);
  const [verb, setVerb] = useState({ ...resetState, id: uuidv4() });
  const { user, getAccessTokenSilently } = useAuth0();

  const inputRef = useRef();

  const focusOnPolishVerb = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    focusOnPolishVerb();
  }, []);

  const handleChange = (event) => {
    const { value, name } = event.target;
    const initialDataKeys = Object.keys(initialData).slice(1);

    initialDataKeys.forEach((el) => {
      if (Object.keys(initialData[el]).includes(name)) {
        setVerb((previous) => {
          const newVerb = JSON.parse(JSON.stringify({ ...previous }));
          newVerb[el][name] = value;
          return newVerb;
        });
      }
    });

    if (isEditing) {
      initialDataKeys.forEach((el) => {
        if (Object.keys(initialData[el]).includes(name)) {
          setCurrentVerb((previous) => {
            const newVerb = { ...previous };
            newVerb[el][name] = value;
            return newVerb;
          });
        }
      });
    }
  };

  const putToExpressApp = async () => {
    try {
      const token = await getAccessTokenSilently();

      const controller = new AbortController();
      const { signal } = controller;

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/kanban/${user.sub}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(columns),
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isEditing) {
      columns.column_A.items.push(verb);
    }
    setIsEditing(false);
    setVerb({ ...resetState });
    setCurrentVerb({ ...resetState });
    await putToExpressApp();
    setOpen(false);
  };

  const exitEditForm = () => {
    setIsEditing(false);
    setOpen(false);
  };

  return (
    <>
      <div className='kanbanform-form-wrapper'>
        <form className='kanbanform-form'>
          <p className='heading-kanban'>
            Pattern recognition, association and iconisation
          </p>

          <ChakraProvider>
            <div className='wrapper-field-inputs'>
              <div className='polish-infinitive'>
                <label htmlFor='polish_word'>Polish Verb</label>
                <input
                  className='kanban-form-input'
                  ref={inputRef}
                  placeholder=''
                  id='polish_word'
                  type='text'
                  name='polish_word'
                  required
                  onChange={handleChange}
                  value={
                    isEditing
                      ? currentVerb.word_image.polish_word
                      : verb.word_image.polish_word
                  }
                />
              </div>
              <div className='english-infinitive'>
                <label htmlFor='english_word'>English Verb</label>
                <input
                  className='kanban-form-input'
                  placeholder=''
                  id='english_word'
                  type='text'
                  name='english_word'
                  required
                  onChange={handleChange}
                  value={
                    isEditing
                      ? currentVerb.word_image.english_word
                      : verb.word_image.english_word
                  }
                />
              </div>
              <div className='image_url'>
                <label htmlFor='image_url'>Image URL</label>
                <input
                  className='kanban-form-input'
                  placeholder=''
                  id='image_url'
                  type='text'
                  name='image_url'
                  onChange={handleChange}
                  value={
                    isEditing
                      ? currentVerb.word_image.image_url
                      : verb.word_image.image_url
                  }
                />
              </div>
              <div className='radio-buttons'>
                <RadioGroup>
                  <Stack direction='column' pl={2} pt={2}>
                    <Radio
                      type='radio'
                      id='dokonany'
                      name='aspect'
                      value='Dokonany'
                      checked={
                        isEditing
                          ? currentVerb.gram_case.aspect === 'Dokonany'
                          : verb.gram_case.aspect === 'Dokonany'
                      }
                      onChange={handleChange}
                    >
                      Dokonany
                    </Radio>
                    <Radio
                      type='radio'
                      id='niedokonany'
                      name='aspect'
                      value='Niedokonany'
                      checked={
                        isEditing
                          ? currentVerb.gram_case.aspect === 'Niedokonany'
                          : verb.gram_case.aspect === 'Niedokonany'
                      }
                      onChange={handleChange}
                    >
                      Niedokonany
                    </Radio>
                  </Stack>
                </RadioGroup>
              </div>

              <div className='gram-case'>
                <label htmlFor='gram_case'>Case</label>
                <select
                  id='gram_case'
                  name='case'
                  onChange={handleChange}
                  value={
                    isEditing ? currentVerb.gram_case.case : verb.gram_case.case
                  }
                >
                  <option value='Mianownik'>Mianownik</option>
                  <option value='Dopełniacz'>Dopełniacz</option>
                  <option value='Celownik'>Celownik</option>
                  <option value='Biernik'>Biernik</option>
                  <option value='Narzędnik'>Narzędnik</option>
                  <option value='Miejscownik'>Miejscownik</option>
                  <option value='Wołacz'>Wołacz</option>
                </select>
              </div>

              <div className='submit-button'>
                <Button
                  buttonStyle='btn--add-new-verb'
                  buttonSize='btn--medium'
                  id='submit-verb-button'
                  type='submit'
                  onClick={handleSubmit}
                >
                  {!isEditing ? 'Submit' : 'Update'}
                </Button>
              </div>
              <div className='close-modal'>
                <Button
                  buttonStyle='btn--add-new-verb'
                  buttonSize='btn--medium'
                  onClick={() => exitEditForm()}
                >
                  Close
                </Button>
              </div>
            </div>
            <Box bg='blue.200' w='100%' className='test'>
              <Tabs
                isFitted
                variant='soft-rounded'
                colorScheme='blue'
                pt={4}
                pl={2}
                pr={2}
                w='100%'
                className='form-tabs'
              >
                <TabList mb='0.1' width={'200'}>
                  <Tab color={'white'}>Present Tense</Tab>
                  <Tab color={'white'}>Past Masculine</Tab>
                  <Tab color={'white'}>Past Feminine</Tab>
                </TabList>
                <TabList mb='0.1'>
                  <Tab color={'white'}>Future Masculine</Tab>
                  <Tab color={'white'}>Future Feminine</Tab>
                  <Tab color={'white'}>Future Imperfect</Tab>
                </TabList>
                <TabList mb='0.1'>
                  <Tab color={'white'}>Conditional Masculine</Tab>
                  <Tab color={'white'}>Conditional Feminine</Tab>
                  <Tab color={'white'}>Imperative</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className='present-tense'>
                      <div className='table-entry'>
                        <label htmlFor='present_ja'>Present</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ja jestem'
                          id='present_ja'
                          type='text'
                          name='present_ja'
                          required
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.present.present_ja
                              : verb.present.present_ja
                          }
                        />
                      </div>
                      <div className='table-entry'>
                        <label htmlFor='present_ty'>Present</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ty jesteś'
                          id='present_ty'
                          type='text'
                          name='present_ty'
                          required
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.present.present_ty
                              : verb.present.present_ty
                          }
                        />
                      </div>
                      <div className='table-entry'>
                        <label htmlFor='present_on_ona_ono'>Present</label>
                        <input
                          className='kanban-form-input'
                          placeholder='On jest'
                          id='present_on_ona_ono'
                          type='text'
                          name='present_on_ona_ono'
                          required
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.present.present_on_ona_ono
                              : verb.present.present_on_ona_ono
                          }
                        />
                      </div>
                      <div className='table-entry'>
                        <label htmlFor='present_my'>Present</label>
                        <input
                          className='kanban-form-input'
                          placeholder='My jesteśmy'
                          id='present_my'
                          type='text'
                          name='present_my'
                          required
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.present.present_my
                              : verb.present.present_my
                          }
                        />
                      </div>
                      <div className='table-entry'>
                        <label htmlFor='present_wy'>Present</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Wy jesteście'
                          id='present_wy'
                          type='text'
                          name='present_wy'
                          required
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.present.present_wy
                              : verb.present.present_wy
                          }
                        />
                      </div>
                      <div className='table-entry'>
                        <label htmlFor='present_oni_one'>Present</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Oni/one są'
                          id='present_oni_one'
                          type='text'
                          name='present_oni_one'
                          required
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.present.present_oni_one
                              : verb.present.present_oni_one
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className='past-masculine'>
                      <div className='table-entry'>
                        <label htmlFor='past_ja_masc'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ja byłem'
                          id='past_ja_masc'
                          type='text'
                          name='past_ja_masc'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_ja_masc
                              : verb.past.past_ja_masc
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_ty_masc'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ty byłeś'
                          id='past_ty_masc'
                          type='text'
                          name='past_ty_masc'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_ty_masc
                              : verb.past.past_ty_masc
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_on_masc'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='On był'
                          id='past_on_masc'
                          type='text'
                          name='past_on_masc'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_on_masc
                              : verb.past.past_on_masc
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_my_masc'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='My byliśmy'
                          id='past_my_masc'
                          type='text'
                          name='past_my_masc'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_my_masc
                              : verb.past.past_my_masc
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_wy_masc'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Wy byliście'
                          id='past_wy_masc'
                          type='text'
                          name='past_wy_masc'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_wy_masc
                              : verb.past.past_wy_masc
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_oni_masc'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Oni byli'
                          id='past_oni_masc'
                          type='text'
                          name='past_oni_masc'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_oni_masc
                              : verb.past.past_oni_masc
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='past-feminine'>
                      <div className='table-entry'>
                        <label htmlFor='past_ja_fem'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ja byłam'
                          id='past_ja_fem'
                          type='text'
                          name='past_ja_fem'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_ja_fem
                              : verb.past.past_ja_fem
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_ty_fem'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ty byłaś'
                          id='past_ty_fem'
                          type='text'
                          name='past_ty_fem'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_ty_fem
                              : verb.past.past_ty_fem
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_ona_fem'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ona była'
                          id='past_ona_fem'
                          type='text'
                          name='past_ona_fem'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_ona_fem
                              : verb.past.past_ona_fem
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_my_fem'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='My byłyśmy'
                          id='past_my_fem'
                          type='text'
                          name='past_my_fem'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_my_fem
                              : verb.past.past_my_fem
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_wy_fem'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Wy byłyście'
                          id='past_wy_fem'
                          type='text'
                          name='past_wy_fem'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_wy_fem
                              : verb.past.past_wy_fem
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='past_one_fem'>Past</label>
                        <input
                          className='kanban-form-input'
                          placeholder='One były'
                          id='past_one_fem'
                          type='text'
                          name='past_one_fem'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.past.past_one_fem
                              : verb.past.past_one_fem
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='future-masculine'>
                      <div className='table-entry'>
                        <label htmlFor='future_masc_ja'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ja będę'
                          id='future_masc_ja'
                          type='text'
                          name='future_masc_ja'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_masc.future_masc_ja
                              : verb.future_masc.future_masc_ja
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_masc_ty'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ty będziesz'
                          id='future_masc_ty'
                          type='text'
                          name='future_masc_ty'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_masc.future_masc_ty
                              : verb.future_masc.future_masc_ty
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_masc_on'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='On będzie'
                          id='future_masc_on'
                          type='text'
                          name='future_masc_on'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_masc.future_masc_on
                              : verb.future_masc.future_masc_on
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_masc_my'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='My będziemy'
                          id='future_masc_my'
                          type='text'
                          name='future_masc_my'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_masc.future_masc_my
                              : verb.future_masc.future_masc_my
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_masc_wy'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Wy będziecie'
                          id='future_masc_wy'
                          type='text'
                          name='future_masc_wy'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_masc.future_masc_wy
                              : verb.future_masc.future_masc_wy
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_masc_oni'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Oni będą'
                          id='future_masc_oni'
                          type='text'
                          name='future_masc_oni'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_masc.future_masc_oni
                              : verb.future_masc.future_masc_oni
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='future-feminine'>
                      <div className='table-entry'>
                        <label htmlFor='future_fem_ja'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ja będę'
                          id='future_fem_ja'
                          type='text'
                          name='future_fem_ja'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_fem.future_fem_ja
                              : verb.future_fem.future_fem_ja
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        {' '}
                        <label htmlFor='future_fem_ty'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ty będziesz'
                          id='future_fem_ty'
                          type='text'
                          name='future_fem_ty'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_fem.future_fem_ty
                              : verb.future_fem.future_fem_ty
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_fem_ona'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ona będzie'
                          id='future_fem_ona'
                          type='text'
                          name='future_fem_ona'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_fem.future_fem_ona
                              : verb.future_fem.future_fem_ona
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        {' '}
                        <label htmlFor='future_fem_my'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='My będziemy'
                          id='future_fem_my'
                          type='text'
                          name='future_fem_my'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_fem.future_fem_my
                              : verb.future_fem.future_fem_my
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_fem_wy'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Wy będziecie'
                          id='future_fem_wy'
                          type='text'
                          name='future_fem_wy'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_fem.future_fem_wy
                              : verb.future_fem.future_fem_wy
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='future_fem_one'>Future</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Oni będą'
                          id='future_fem_one'
                          type='text'
                          name='future_fem_one'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.future_fem.future_fem_one
                              : verb.future_fem.future_fem_one
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='future-imperfect'>
                      <div className='table-entry'>
                        <label htmlFor='imp_future_ja'>Imperfect</label>
                        <input
                          className='kanban-form-input'
                          placeholder=''
                          id='imp_future_ja'
                          type='text'
                          name='imp_future_ja'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imp_future.imp_future_ja
                              : verb.imp_future.imp_future_ja
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        {' '}
                        <label htmlFor='imp_future_ty'>Imperfect</label>
                        <input
                          className='kanban-form-input'
                          placeholder=''
                          id='imp_future_ty'
                          type='text'
                          name='imp_future_ty'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imp_future.imp_future_ty
                              : verb.imp_future.imp_future_ty
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imp_future_on_ona_ono'>Imperfect</label>
                        <input
                          className='kanban-form-input'
                          placeholder=''
                          id='imp_future_on_ona_ono'
                          type='text'
                          name='imp_future_on_ona_ono'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imp_future.imp_future_on_ona_ono
                              : verb.imp_future.imp_future_on_ona_ono
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imp_future_my'>Imperfect</label>
                        <input
                          className='kanban-form-input'
                          placeholder=''
                          id='imp_future_my'
                          type='text'
                          name='imp_future_my'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imp_future.imp_future_my
                              : verb.imp_future.imp_future_my
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imp_future_wy'>Imperfect</label>
                        <input
                          className='kanban-form-input'
                          placeholder=''
                          id='imp_future_wy'
                          type='text'
                          name='imp_future_wy'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imp_future.imp_future_wy
                              : verb.imp_future.imp_future_wy
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imp_future_oni_one'>Imperfect</label>
                        <input
                          className='kanban-form-input'
                          placeholder=''
                          id='imp_future_oni_one'
                          type='text'
                          name='imp_future_oni_one'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imp_future.imp_future_oni_one
                              : verb.imp_future.imp_future_oni_one
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='conditional-masculine'>
                      <div className='table-entry'>
                        <label htmlFor='conditional_masculine_ja'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Masculine'
                          id='conditional_masculine_ja'
                          type='text'
                          name='conditional_masculine_ja'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_masculine
                                  .conditional_masculine_ja
                              : verb.conditional_masculine
                                  .conditional_masculine_ja
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        {' '}
                        <label htmlFor='conditional_masculine_ty'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Masculine'
                          id='conditional_masculine_ty'
                          type='text'
                          name='conditional_masculine_ty'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_masculine
                                  .conditional_masculine_ty
                              : verb.conditional_masculine
                                  .conditional_masculine_ty
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_masculine_on'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Masculine'
                          id='conditional_masculine_on'
                          type='text'
                          name='conditional_masculine_on'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_masculine
                                  .conditional_masculine_on
                              : verb.conditional_masculine
                                  .conditional_masculine_on
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_masculine_my'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Masculine'
                          id='conditional_masculine_my'
                          type='text'
                          name='conditional_masculine_my'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_masculine
                                  .conditional_masculine_my
                              : verb.conditional_masculine
                                  .conditional_masculine_my
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_masculine_wy'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Masculine'
                          id='conditional_masculine_wy'
                          type='text'
                          name='conditional_masculine_wy'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_masculine
                                  .conditional_masculine_wy
                              : verb.conditional_masculine
                                  .conditional_masculine_wy
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_masculine_oni'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Masculine'
                          id='conditional_masculine_oni'
                          type='text'
                          name='conditional_masculine_oni'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_masculine
                                  .conditional_masculine_oni
                              : verb.conditional_masculine
                                  .conditional_masculine_oni
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='conditional-feminine'>
                      <div className='table-entry'>
                        <label htmlFor='conditional_feminine_ja'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Feminine'
                          id='conditional_feminine_ja'
                          type='text'
                          name='conditional_feminine_ja'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_feminine
                                  .conditional_feminine_ja
                              : verb.conditional_feminine
                                  .conditional_feminine_ja
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_feminine_ty'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Feminine'
                          id='conditional_feminine_ty'
                          type='text'
                          name='conditional_feminine_ty'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_feminine
                                  .conditional_feminine_ty
                              : verb.conditional_feminine
                                  .conditional_feminine_ty
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_feminine_ona'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Feminine'
                          id='conditional_feminine_ona'
                          type='text'
                          name='conditional_feminine_ona'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_feminine
                                  .conditional_feminine_ona
                              : verb.conditional_feminine
                                  .conditional_feminine_ona
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_feminine_my'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Feminine'
                          id='conditional_feminine_my'
                          type='text'
                          name='conditional_feminine_my'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_feminine
                                  .conditional_feminine_my
                              : verb.conditional_feminine
                                  .conditional_feminine_my
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_feminine_wy'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Feminine'
                          id='conditional_feminine_wy'
                          type='text'
                          name='conditional_feminine_wy'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_feminine
                                  .conditional_feminine_wy
                              : verb.conditional_feminine
                                  .conditional_feminine_wy
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='conditional_feminine_one'>
                          Conditional
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='Feminine'
                          id='conditional_feminine_one'
                          type='text'
                          name='conditional_feminine_one'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.conditional_feminine
                                  .conditional_feminine_one
                              : verb.conditional_feminine
                                  .conditional_feminine_one
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className='imperative'>
                      <div className='table-entry'>
                        <label htmlFor='imperative_ja'>Imperative</label>
                        <input
                          className='kanban-form-input'
                          placeholder='*_________*'
                          id='imperative_ja'
                          type='text'
                          name='imperative_ja'
                          value='*_________*'
                          readOnly
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imperative_ty'>Imperative</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Ty'
                          id='imperative_ty'
                          type='text'
                          name='imperative_ty'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imperative.imperative_ty
                              : verb.imperative.imperative_ty
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imperative_on_ona_oni'>
                          Imperative
                        </label>
                        <input
                          className='kanban-form-input'
                          placeholder='On, ona, oni'
                          id='imperative_on_ona_oni'
                          type='text'
                          name='imperative_on_ona_oni'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imperative.imperative_on_ona_oni
                              : verb.imperative.imperative_on_ona_oni
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imperative_my'>Imperative</label>
                        <input
                          className='kanban-form-input'
                          placeholder='My'
                          id='imperative_my'
                          type='text'
                          name='imperative_my'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imperative.imperative_my
                              : verb.imperative.imperative_my
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imperative_wy'>Imperative</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Wy'
                          id='imperative_wy'
                          type='text'
                          name='imperative_wy'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imperative.imperative_wy
                              : verb.imperative.imperative_wy
                          }
                        />
                      </div>

                      <div className='table-entry'>
                        <label htmlFor='imperative_oni'>Imperative</label>
                        <input
                          className='kanban-form-input'
                          placeholder='Oni, one'
                          id='imperative_oni'
                          type='text'
                          name='imperative_oni'
                          onChange={handleChange}
                          value={
                            isEditing
                              ? currentVerb.imperative.imperative_oni
                              : verb.imperative.imperative_oni
                          }
                        />
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </ChakraProvider>
        </form>
        <div className='shutter-stock-wrapper-kanban'>
          <ShutterStock />
        </div>
      </div>
    </>
  );
};

export default KanbanForm;
