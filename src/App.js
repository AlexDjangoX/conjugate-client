import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Hero from './components/hero/Hero';
import Kanban from './components/drag&drop/Kanban';
import Profile from './components/profile/Profile';
import Notes from './components/notes/Notes';
import Nouns from './components/nouns/Nouns';
import './App.css';

function App() {
  const [columns, setColumns] = useState({});

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/nouns" element={<Nouns />} />
        <Route
          path="/notatki"
          element={<Notes columns={columns} setColumns={setColumns} />}
        />
        <Route
          path="/kanban"
          element={<Kanban columns={columns} setColumns={setColumns} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Hero replace to="/" />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
