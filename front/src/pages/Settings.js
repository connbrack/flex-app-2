
import LoginForm from '../components/LoginForm';

import '../css/styles.css';

export default function Settings() {

  function clearStorage() {
    localStorage.clear();
  };


  return (
    <div>
      <h1>Settings !!</h1>
      <br />
      <br />
      <LoginForm />
      <br />

      <p> This data is saved to your browser, and is not logged anywhere else. It is accessed only when car booking attempts are requested. </p>
      <br />

      <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={clearStorage}> Clear storage </span>
    </div>
  );
}
