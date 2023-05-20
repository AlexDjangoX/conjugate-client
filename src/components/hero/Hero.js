import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import './Hero.css';

const Hero = () => {
  const youTubeUrl = 'https://vimeo.com/786250341';

  return (
    <>
      <div className='hero-container'>
        <h1>Polish Language Ninja</h1>

        <div className='video'>
          {youTubeUrl && (
            <>
              <div style={{ padding: '75% 0 0 0', position: 'relative' }}>
                <iframe
                  src='https://player.vimeo.com/video/786325458?h=f713208f76&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  title='2023-01-04 13-35-45.mkv'
                ></iframe>
              </div>
            </>
          )}
        </div>

        <main className='hero-main'>
          <ul>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              For POLISH Language Students
            </li>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              Beginner to infinity and beyond
            </li>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              Add your own custom content
            </li>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              Use imagery to retain vocabulary
            </li>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              Discover patterns of Conjugation
            </li>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              Create custom flashcards
            </li>
            <li>
              <FontAwesomeIcon
                icon={solid('check')}
                size='1x'
                style={{ paddingRight: 15 }}
              />
              All in a fully responsive Application
            </li>
          </ul>
        </main>
      </div>
    </>
  );
};
export default Hero;
