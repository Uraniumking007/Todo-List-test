import PropTypes from 'prop-types';
import { Button } from '@mantine/core';

const CSButton = ({ color, text, onClick }) => {
  return (
    <>
      <Button variant='gradient' gradient={color} onClick={onClick}>
        {text}
      </Button>
    </>
    // <button
    //   onClick={onClick}
    //   style={{ backgroundColor: color }}
    //   className='btn'
    // >
    //   {text}
    // </button>
  );
};

CSButton.defaultProps = {
  color: 'black',
};

CSButton.PropTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
};

export default CSButton;
