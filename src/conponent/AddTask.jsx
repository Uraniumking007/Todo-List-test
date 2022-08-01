import { useState } from 'react';
import { TextInput } from '@mantine/core';
import { Checkbox } from '@mantine/core';
import { Button } from '@mantine/core';
import React from 'react';

const AddTask = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [day, setDay] = useState('');
  const [reminder, setReminder] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      alert('Please add a Task');
      return;
    }
    onAdd({ text, day, reminder });

    setText('');
    setDay('');
    setReminder(false);
  };

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <TextInput
          placeholder='Add Task'
          label='Task'
          radius='md'
          size='lg'
          onChange={(e) => setText(e.target.value)}
        />

        {/* <label>Task</label>
        <input
          type='text'
          placeholder='Add Task'
          value={text}
          onChange={(e) => setText(e.target.value)}
        /> */}
      </div>

      <div>
        <TextInput
          placeholder='Add Date & Time'
          label='Date & Time'
          radius='md'
          size='lg'
          onChange={(e) => setDay(e.target.value)}
        />
      </div>

      {/* <div className='form-control'>
        <label>Day & Time</label>
        <input
          type='text'
          placeholder='Add Day & Time'
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </div> */}
      <br />
      <div>
        <Checkbox
          label='Reminder'
          size='lg'
          onChange={(e) => setReminder(e.currentTarget.checked)}
        />
      </div>

      {/* <div className='form-control form-control-check'>
        <label>Reminder</label>
        <input
          type='checkbox'
          checked={reminder}
          value={reminder}
          onChange={(e) => setReminder(e.currentTarget.checked)}
        />
      </div> */}

      <center>
        <Button type='submit' mt='lg'>
          Save Task
        </Button>
      </center>

      {/* <input type='submit' value='Save Task' className='btn btn-block' /> */}
    </form>
  );
};

export default AddTask;
