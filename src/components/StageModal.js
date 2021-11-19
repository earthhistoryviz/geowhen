import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useAppState, useActions } from '../overmind';

const imageExists = (imageUrl) => {
  const http = new XMLHttpRequest();
  http.open('HEAD', imageUrl, false);
  http.send();
  return http.status !== 404;
};

const StageModal = () => {
  const state = useAppState();
  const actions = useActions();

  const handleCloseModal = () => { actions.selectItem(false); };

  let stageimage = false;
  if (state.selectedItem) {
    stageimage = `/geowhen/stage-charts/${state.selectedItem.Period.toUpperCase()}_regional.jpg`;
    if (!imageExists(stageimage)) {
      stageimage = false;
    }
  }

  console.log(state.selectedItem);

  return (
    <Modal show={state.selectedItem !== false} onHide={handleCloseModal} size='xl' style={{ padding: '0px' }}>
      <Modal.Header closeButton>
        <Modal.Title>Stage Information - {state.selectedItem.STAGE}</Modal.Title>
      </Modal.Header>

      <Modal.Body className='p-sm-5'>
        {
          !state.selectedItem
            ? ''
            : <div className='border shadow-sm mb-4 pb-4 pt-2' style={{ border: '20px solid ', borderRadius: '10px' }}>
              <div className='w-100' align='center'>
                <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                  <div>
                    <h3>{state.selectedItem.STAGE}</h3>
                  </div>
                  <div style={{ fontWeight: 'normal' }}>
                    (Period: {state.selectedItem.Period})
                  </div>
                </div>
                {!state.selectedItem.Rank ? '' : 
                  <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      Rank:
                    </div>
                    <div>
                      {state.selectedItem.Rank}
                    </div>
                  </div>
                }
                <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Region:
                  </div>
                  <div>
                    {state.selectedItem.Region}
                  </div>
                </div>
                <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Top Age:
                  </div>
                  <div>
                    {+(state.selectedItem.TOP).toFixed(3)}
                  </div>
                </div>
                <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Base Age:
                  </div>
                  <div>
                    {+(state.selectedItem.Base).toFixed(3)}
                  </div>
                </div>
                {!state.selectedItem.Comments ? '' : 
                  <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      Comments:
                    </div>
                    <div>
                      {state.selectedItem.Comments}
                    </div>
                  </div>
                }
                <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Top Calibration:
                  </div>
                  <div>
                    {state.selectedItem['Top calibration']}
                  </div>
                </div>
                <div style={{ border: '1px solid #DDDDDD', borderRadius: '3px', boxShadow: '3px 3px #CCCCC', margin: '5px 5px 5px 5px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Base Calibration:
                  </div>
                  <div>
                    {state.selectedItem['Base calibration']}
                  </div>
                </div>

              </div>
              <div className='d-flex justify-content-center' style={{ overflow: 'scroll' }}>
                {stageimage ? <img className='m-auto' src={stageimage} alt='Stage Chart' /> : ''}
              </div>
            </div>
        }
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StageModal;
