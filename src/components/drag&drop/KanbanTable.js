import React from 'react';
import './KanbanTable.css';

const KanbanTable = ({ item, column }) => {
  return (
    <>
      {column.name === 'Nowe słowa' && (
        <>
          <div className='table-wrapper'>
            <table>
              <tbody>
                <tr>
                  <td>{item.present.present_ja}</td>
                  <td>{item.present.present_ty}</td>
                </tr>
                <tr>
                  <td>{item.present.present_on_ona_ono}</td>
                  <td>{item.present.present_my}</td>
                </tr>
                <tr>
                  <td>{item.present.present_wy}</td>
                  <td>{item.present.present_oni_one}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='card-image-kanban'>
            {item.word_image.image_url && (
              <img
                src={item.word_image.image_url}
                alt='img'
                height='150'
                width='200'
              />
            )}
          </div>
        </>
      )}
      {column.name === 'Przeszły' && (
        <div className='table-wrapper'>
          <table>
            <tbody>
              <tr>
                <td className='masculine'>{item.past.past_ja_masc}</td>
                <td className='feminine'>{item.past.past_ja_fem}</td>
              </tr>
              <tr>
                <td className='masculine-alt'>{item.past.past_ty_masc}</td>
                <td className='feminine-alt'>{item.past.past_ty_fem}</td>
              </tr>
              <tr>
                <td className='masculine'>{item.past.past_on_masc}</td>
                <td className='feminine'>{item.past.past_ona_fem}</td>
              </tr>
              <tr>
                <td className='masculine-alt'>{item.past.past_my_masc}</td>
                <td className='feminine'>{item.past.past_my_fem}</td>
              </tr>
              <tr>
                <td className='masculine'>{item.past.past_wy_masc}</td>
                <td className='feminine-alt'>{item.past.past_wy_fem}</td>
              </tr>
              <tr>
                <td className='masculine-alt'>{item.past.past_oni_masc}</td>
                <td className='feminine'>{item.past.past_one_fem}</td>
              </tr>
              <tr>
                <td colSpan='2'>{item.word_image.english_word}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {column.name === 'Przyszły' && (
        <div className='table-wrapper'>
          <table>
            <tbody>
              <tr>
                <td>{item.imp_future.imp_future_ja}</td>
                <td>{item.imp_future.imp_future_ty}</td>
              </tr>
              <tr>
                <td>{item.imp_future.imp_future_on_ona_ono}</td>
                <td>{item.imp_future.imp_future_my}</td>
              </tr>
              <tr>
                <td>{item.imp_future.imp_future_wy}</td>
                <td>{item.imp_future.imp_future_oni_one}</td>
              </tr>
              <tr>
                <td className='masculine'>{item.future_masc.future_masc_ja}</td>
                <td className='feminine'>{item.future_fem.future_fem_ja}</td>
              </tr>
              <tr>
                <td className='masculine-alt'>
                  {item.future_masc.future_masc_ty}
                </td>
                <td className='feminine-alt'>
                  {item.future_fem.future_fem_ty}
                </td>
              </tr>
              <tr>
                <td className='masculine'>{item.future_masc.future_masc_on}</td>
                <td className='feminine'>{item.future_fem.future_fem_ona}</td>
              </tr>
              <tr>
                <td className='masculine-alt'>
                  {item.future_masc.future_masc_my}
                </td>
                <td className='feminine-alt'>
                  {item.future_fem.future_fem_my}
                </td>
              </tr>
              <tr>
                <td className='masculine'>{item.future_masc.future_masc_wy}</td>
                <td className='feminine'>{item.future_fem.future_fem_wy}</td>
              </tr>
              <tr>
                <td className='masculine-alt'>
                  {item.future_masc.future_masc_oni}
                </td>
                <td className='feminine-alt'>
                  {item.future_fem.future_fem_one}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default KanbanTable;
