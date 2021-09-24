import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { InputGroup, FormControl, Modal, FloatingLabel, Form, Row, Col } from 'react-bootstrap';

const Search = (props) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <InputGroup className='my-3' size='lg'>
        <FormControl onChange={props.onChange} aria-label='Large' aria-describedby='inputGroup-sizing-sm' placeholder='Search' />
        <Button variant='primary' onClick={handleShowModal}>
          Filter menu
        </Button>

        <Modal size='lg' show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Advance Filtering Menu</Modal.Title>
          </Modal.Header>

          <Modal.Body className='p-sm-5'>
            <Form>
              <h5>Search by:</h5>
              <FloatingLabel className='my-2' controlId='floatingSelect' label='By Stage'>
                <Form.Select aria-label='Floating label select example'>
                  <option value='0'>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </Form.Select>
              </FloatingLabel>

              <FloatingLabel className='my-2' controlId='floatingSelect' label='By Region'>
                <Form.Select aria-label='Floating label select example'>
                  <option value='0'>All</option>
                  <option value='1'>One</option>
                  <option value='2'>Two</option>
                  <option value='3'>Three</option>
                </Form.Select>
              </FloatingLabel>

              <Form.Group as={Row} className='mb-3'>
                <Form.Label column sm='2'>
                  By Age:
                </Form.Label>
                <Col sm='4'>
                  <Form.Control placeholder='Lower Bound' />
                </Col>
                <Col className='d-flex justify-content-center' sm='2'>
                  <p className='m-auto'>to</p>
                </Col>
                <Col sm='4'>
                  <Form.Control placeholder='Upper Bound' />
                </Col>
              </Form.Group>

              <hr />
              <h5>Sort by:</h5>

              <Form.Group className='mb-3'>
                <Form.Check
                  type='radio'
                  label='sort-alphabetically'
                  name='formHorizontalRadios'
                  id='formHorizontalRadios1'
                />
                <Form.Check
                  type='radio'
                  label='sort-by-age'
                  name='formHorizontalRadios'
                  id='formHorizontalRadios2'
                />
                <Form.Check
                  type='radio'
                  label='sort-by-region'
                  name='formHorizontalRadios'
                  id='formHorizontalRadios3'
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
            <Button variant='danger' onClick={handleCloseModal}>
              Reset
            </Button>
            <Button variant='primary' onClick={handleCloseModal}>
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
