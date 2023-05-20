import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { v4 as uuidv4 } from 'uuid';
import { dummyData } from '../../utils/dummyData';
import './Kanban.css';
import Atom from '../spinner/Atom';
import KanbanTable from './KanbanTable';
import KanbanForm from './KanbanForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '@mui/material';
import { Button } from '../button/Button.js';

const onDragEnd = (result, columns, setColumns) => {
  const { source, destination } = result;

  if (!result.destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const Kanban = ({ columns, setColumns }) => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);
  const [currentVerb, setCurrentVerb] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [deleteVerb, setDeleteVerb] = useState(false);
  const [verbToDeleteId, setVerbToDeleteId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadDummyData = async () => {
    if (!isAuthenticated) {
      setIsLoading(true);
      await setColumns(dummyData.position);
    }
    setIsLoading(false);
    return;
  };

  console.log(columns);

  useEffect(() => {
    loadDummyData();
    // eslint-disable-next-line
  }, []);

  // START LOCAL JSON-SERVER

  // const axios = require('axios');

  // const getFromDb = () => {
  //   axios
  //     .get(`http://localhost:8000/position`)
  //     .then(function (response) {
  //       setColumns(response.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   getFromDb();
  // }, []);

  // const postToDb = () => {
  //   axios
  //     .post(`http://localhost:8000/position`, columns)
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {
  //   if (user) setTimeout(postToDb, 900);
  // }, [columns]);

  // END LOCAL JSON-SERVER

  const getFromExpressApp = async (signal) => {
    try {
      setIsLoading(true);

      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/protected/kanban/${user?.sub}`,
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

      if (user) {
        const returnFromGetRequest = await response.json();
        let dataToRender = returnFromGetRequest.data?.kanbanObject;

        await setColumns(dataToRender);
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
    // eslint-disable-next-line
  }, []);

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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    if (user) setTimeout(putToExpressApp, 900);
    // eslint-disable-next-line
  }, [columns]);

  const editHandler = (currentVerb) => {
    setOpen(true);
    setIsEditing(true);
    setCurrentVerb(currentVerb);
  };

  let timer;

  const sortByUserInput = async (event) => {
    const { value } = event.target;

    event.preventDefault();

    clearTimeout(timer);

    timer = setTimeout(() => {
      const verbArray = columns.column_D.items;

      let sortedArray = verbArray.sort((a, b) => {
        if (
          a.word_image.polish_word.toLowerCase() >
          b.word_image.polish_word.toLowerCase()
        )
          return 1;
        return -1;
      });

      sortedArray = verbArray.sort((a, b) => {
        if (
          a.word_image.polish_word.toLowerCase().startsWith(value) >
          b.word_image.polish_word.toLowerCase().startsWith(value)
        )
          return -1;
        return 1;
      });

      const updatedObject = () => {
        const objClone = JSON.parse(JSON.stringify({ ...columns }));
        for (let j in objClone) {
          if (objClone[j].name === 'Stare słowa') {
            objClone[j].items = sortedArray;
          }
        }

        return objClone;
      };

      setColumns(updatedObject());
    }, 2000);
  };

  const prepareDelete = (verbId) => {
    setVerbToDeleteId(verbId);
    setDeleteVerb(true);
  };

  const deleteHandler = async () => {
    if (deleteVerb) {
      const verbArray = columns.column_D.items;

      const updatedVerbArray = verbArray.filter(
        (el) => el.id !== verbToDeleteId
      );

      const updatedObject = () => {
        const objClone = JSON.parse(JSON.stringify({ ...columns }));
        for (let j in objClone) {
          if (objClone[j].name === 'Stare słowa') {
            objClone[j].items = updatedVerbArray;
          }
        }

        return objClone;
      };

      await setColumns(updatedObject());
      // putToExpressApp();
      setDeleteVerb(false);
      setVerbToDeleteId('');
    }
  };

  return (
    <>
      <div className="new-verb-button-wrapper">
        {isAuthenticated && (
          <div className="new-verb-buttons">
            <Button
              buttonStyle="btn--add-new-verb"
              buttonSize="btn--medium"
              onClick={() => setOpen(true)}
            >
              Add Verb
            </Button>
            <Button buttonStyle="btn--add-new-verb">
              <a
                href="https://cooljugator.com/pl"
                target="_blank"
                rel="noreferrer"
              >
                Koniugacja
              </a>
            </Button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="kanban-log-in-prompt">
            <p>Log in for interactive experience</p>
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <>
          <KanbanForm
            setOpen={setOpen}
            columns={columns}
            currentVerb={currentVerb}
            setCurrentVerb={setCurrentVerb}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </>
      </Modal>
      {isLoading && <Atom size="200" color="#54a8f1" animationDuration="700" />}
      <div className="kanban-wrapper">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className="kanban-columns" key={uuidv4()}>
                {(column.name === 'Nowe słowa' ||
                  column.name === 'Przeszły' ||
                  column.name === 'Przyszły' ||
                  column.name === 'Stare słowa') && (
                  <h2 className="kanban-header">{column.name}</h2>
                )}

                <div style={{ margin: 2 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className="kanban-droppable"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'lightblue'
                              : 'lightgrey',
                          }}
                        >
                          {columnId === 'column_D' && (
                            <>
                              <div className="kanban-search-input">
                                <input
                                  id="verb-search"
                                  type="text"
                                  name="verb-search"
                                  placeholder="Search verb"
                                  onChange={sortByUserInput}
                                />
                              </div>
                            </>
                          )}

                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      className="kanban-draggable"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        backgroundColor: snapshot.isDragging
                                          ? '#263B4A'
                                          : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div className="card-item-content">
                                        <span
                                          className="card-item-case-aspect"
                                          style={{
                                            background: item.gram_case.color,
                                          }}
                                        >
                                          {`${item.gram_case.case} - ${item.gram_case.aspect}`}
                                        </span>
                                        {column.name === 'Stare słowa' && (
                                          <>
                                            <div className="delete-btn-wrapper">
                                              {!deleteVerb && (
                                                <Button
                                                  buttonStyle={
                                                    'btn-delete-verb'
                                                  }
                                                  onClick={() =>
                                                    prepareDelete(item.id)
                                                  }
                                                >
                                                  Delete
                                                </Button>
                                              )}

                                              {deleteVerb &&
                                                verbToDeleteId === item.id && (
                                                  <>
                                                    <div className="btn-cancel-delete">
                                                      <Button
                                                        onClick={() =>
                                                          setDeleteVerb(false)
                                                        }
                                                        buttonStyle="btn-cancel-delete"
                                                      >
                                                        Cancel
                                                      </Button>
                                                    </div>
                                                    <div>
                                                      <Button
                                                        onClick={deleteHandler}
                                                        buttonStyle="btn-delete-verb"
                                                      >
                                                        Confirm
                                                      </Button>
                                                    </div>
                                                  </>
                                                )}
                                            </div>
                                          </>
                                        )}
                                        <p>{item.word_image.polish_word}</p>

                                        {column.name === 'Stare słowa' && (
                                          <div className="link-notes-wrapper">
                                            <Link
                                              className="link-notes"
                                              to="/notatki"
                                              state={{ item }}
                                              style={{ color: 'white' }}
                                            >
                                              Notes
                                            </Link>
                                          </div>
                                        )}

                                        <KanbanTable
                                          item={item}
                                          column={column}
                                          setOpen={setOpen}
                                        />
                                        {column.name === 'Nowe słowa' && (
                                          <Button
                                            onClick={() => editHandler(item)}
                                            buttonStyle="btn-edit-verb"
                                          >
                                            Edit
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
};

export default Kanban;
