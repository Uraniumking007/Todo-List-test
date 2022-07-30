import React from 'react';

const addtask = () => {
  return (
    <form className='add-form'>
      <div className='form-control'>
        <label>Task</label>
        <input type='text' placeholder='Add Task' />
      </div>
      <div className='form-control'>
        <label>Day & Time</label>
        <input type='text' placeholder='Add Day & Time' />
      </div>
      <div className='form-control'>
        <label>Reminder</label>
        <input type='check' />
      </div>
      <input type='submit' value='Save Task' />
    </form>
  );
};

export default addtask;
