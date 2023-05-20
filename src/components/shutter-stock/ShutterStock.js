import React, { useState } from 'react';
import './ShutterStock.css';
import { Button } from '../button/Button';

const ShutterStock = () => {
  const [dataApi, setDataApi] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchParameter, setSearchParameter] = useState('');
  const [imageType, setImageType] = useState('illustration');

  const fetchData = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SHUTTERSTOCK_BASE_URL}/v2/images/search?image_type=${imageType}&per_page=100&query=${searchParameter}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_SHUTTERSTOCK_TOKEN}`,
            'Accept-Encoding': 'gzip, deflate, br',
          },
          signal,
        }
      );

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      setDataApi(data.data);
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

  const copyToClipboard = (src) => {
    navigator.clipboard.writeText(src);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
    setSearchParameter('');
  };

  return (
    <div>
      <form className='shutter-form-wrapper' onSubmit={handleSubmit}>
        <input
          className='shutter-form-search-parameter'
          type='text'
          value={searchParameter}
          onChange={(event) => setSearchParameter(event.target.value)}
          placeholder='Search image '
        />
        <select
          className='shutter-form-image-type'
          value={imageType}
          onChange={(event) => setImageType(event.target.value)}
        >
          <option value='illustration'>Illustration</option>
          <option value='vector'>Vector</option>
          <option value='photo'>Photo</option>
        </select>
        <div className='shutter-form-submit-button'>
          <Button
            buttonStyle='btn--add-new-verb'
            buttonSize='btn--medium'
            type='submit'
          >
            Search
          </Button>
        </div>
      </form>
      {showPopup && <div className='popup'>URL copied to clipboard</div>}
      <ul className='image-grid'>
        {dataApi &&
          dataApi.length > 0 &&
          dataApi.map((item) => (
            <li key={item.id}>
              <img
                src={item.assets.huge_thumb.url}
                alt={item.title}
                onDoubleClick={() =>
                  copyToClipboard(item.assets.huge_thumb.url)
                }
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ShutterStock;
