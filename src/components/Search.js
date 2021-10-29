import Button from 'react-bootstrap/Button';
import React from 'react';
import { InputGroup, FormControl, Modal, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
import { useAppState, useActions } from '../overmind';

const Search = (props) => {
  const actions = useActions();
  const state = useAppState();

  const fm = state.view.filterModal;
  const filterOptions = state.view.filterOptions;
  const filterState = fm.stagingFilter;

  const handleCloseModal = () => actions.toggleFilterModal();
  const handleShowModal = () => actions.toggleFilterModal();
  const handleSubmit = () => actions.applyFilters();

  return (
    <>
      <InputGroup className='my-3' size='lg'>
        <FormControl onChange={props.onChange} aria-label='Large' aria-describedby='inputGroup-sizing-sm' placeholder='Search' />
        <Button variant='primary' onClick={handleShowModal}>
          Filter menu
        </Button>

        <Modal size='lg' show={fm.visible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Advance Filtering Menu</Modal.Title>
          </Modal.Header>

          <Modal.Body className='p-sm-5'>
            <Form>
              <h5>Search by:</h5>
              <FloatingLabel className='my-2' controlId='floatingSelect' label='By Period'>
                <Form.Select onChange={event => actions.mergeStagingFilter({ period: event.target.value })} aria-label='Floating label select example'>
                  <option value='' selected={!filterState.period}>All</option>
                  {filterOptions.periods.map((period, index) => (
                    <option key={index} value={period} selected={period === filterState.period}>{period}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>

              <FloatingLabel className='my-2' controlId='floatingSelect' label='By Region'>
                <Form.Select onChange={event => actions.mergeStagingFilter({ region: event.target.value })} aria-label='Floating label select example'>
                  <option value='' selected={!filterState.region}>All</option>
                  {filterOptions.regions.map((region, index) => (
                    <option key={index} value={region} selected={region === filterState.region}>{region}</option>
                  ))}
                </Form.Select>
              </FloatingLabel>

              <Form.Group as={Row} className='mb-3'>
                <Form.Label column sm='2'>
                  By Age:
                </Form.Label>
                <Col sm='4'>
                  <Form.Control
                    type='number'
                    placeholder='Lower Bound'
                    onChange={event => { actions.mergeStagingFilter({ bottomAge: event.target.value }); }}
                    value={filterState.bottomAge}
                  />
                </Col>
                <Col className='d-flex justify-content-center' sm='2'>
                  <p className='m-auto'>to</p>
                </Col>
                <Col sm='4'>
                  <Form.Control
                    type='number'
                    placeholder='Upper Bound'
                    onChange={event => { actions.mergeStagingFilter({ topAge: event.target.value }); }}
                    value={filterState.topAge}
                  />
                </Col>
              </Form.Group>

              <hr />
              <h5>Sort by:</h5>

              <Form.Group
                className='mb-3'
                onChange={event => { actions.mergeStagingFilter({ sortBy: event.target.value }); }}
              >
                <Form.Check
                  type='radio'
                  name='sortBy'
                  label='sort-alphabetically'
                  value='alphabet'
                  checked={filterState.sortBy === 'alphabet'}
                />
                <Form.Check
                  type='radio'
                  name='sortBy'
                  label='sort-by-age'
                  value='age'
                  checked={filterState.sortBy === 'age'}
                />
                <Form.Check
                  type='radio'
                  name='sortBy'
                  label='sort-by-region (coming soon)'
                  value='region'
                  checked={filterState.sortBy === 'region'}
                />
              </Form.Group>
              <hr />
              <h5>Group by:</h5>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant='danger' onClick={actions.resetFilters}>
              Reset
            </Button>
            <Button variant='primary' onClick={handleSubmit}>
              Apply
            </Button>
          </Modal.Footer>
        </Modal>
      </InputGroup>
      <p />
    </>
  );
};

export default Search;
