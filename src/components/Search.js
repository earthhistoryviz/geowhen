import Button from 'react-bootstrap/Button';
import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

const Search = (props) => {
  return (
    <InputGroup className='my-3' size='lg'>
      <FormControl onChange={props.onChange} aria-label='Large' aria-describedby='inputGroup-sizing-sm' placeholder='Search' />
      <Button>Search</Button>
    </InputGroup>
  );
};

export default Search;
