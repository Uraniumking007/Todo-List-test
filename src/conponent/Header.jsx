import CSButton from './Button';

const Header = ({ title, onAdd, showAdd }) => {
  return (
    <header className='header'>
      <h1>{title}</h1>
      <CSButton
        color={
          showAdd
            ? { from: 'orange', to: 'red', deg: 105 }
            : { from: 'teal', to: 'lime', deg: 105 }
        }
        text={showAdd ? 'Close' : 'Add'}
        onClick={onAdd}
      />
    </header>
  );
};

Header.defaultProps = {
  title: 'Task Manager',
};

export default Header;
