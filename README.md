# Polish Language Learning Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To view the deployed application [Polish Conjugator](https://polish-conjugator.herokuapp.com/).

To view a video walk through [Video demonstration](https://vimeo.com/786325458).

## Background

This application is my first solo, fullstack application, built with ReactJS, Chakra UI frontend. The backend is built using Node/Express.

## High level statement of problems which needed to be solved

- Replace written notes, which become disorganized and difficult to use as a study aid
- Find a better way to understand and learn verb conjugation. Present verb conjugation visually and interactively. Find an alternative to available verb conjugation websites which are overwhelming and poorly presented [Replace this website](https://cooljugator.com/pl)
- Find an alternative to Google translate, include a text-to-speech feature
- Find a visual method to help with learning vocabulary, include a well organized way to write short sentences associated with vocabulary
- Stop waisting lesson time by not recording lesson content, leading to unnecessary repetition

## How where problems solved?

- Verb conjugation is presented on a 'Kanban' board. Students use existing verb conjugation websites as a resource, and create there own verbs. Associated with each verb is a student selected image.
- The fact that students are engaged with the language by creating verb conjugation cards on the Kanban board, along with associated imagery, means students cannot but help to recognise verb conjugation patterns.
- A notes page was created which has on hand a translation tool and text-to-speech. On the same page the conjugated verb, along with associated image is visible. Students create their own sentences on this page, bringing together all aspects of the learning experience
- The application is used live in lessons for note taking
- Application is fully mobile responsive which means spare time can be used to go over lessons, instead of flipping through Facebook

## Tech stack

- ReactJS frontend, grid-css, Chakra UI, Material UI (modal)
- Node/Express/Prisma

---

## Landing page, verb conjugation, notes & nouns page

---

<div align="center" style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 85px; justify-content: center;">
 <img loading="lazy" src="public\images\polish-conjugator.png" style="width: 450px; height: 250px;">
 <img loading="lazy" src="public\images\polish-conjugator-verbs.png" style="width: 450px; height: 250px;">
 <img loading="lazy" src="public\images\polish-conjugator-notes.png" style="width: 450px; height: 250px;">
 <img loading="lazy" src="public\images\polish-conjugator-nouns.png" style="width: 450px; height: 250px;">
</div>

---

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---
