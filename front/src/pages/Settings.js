import LoginForm from "../components/LoginForm";
import EnablePush from "../components/EnablePush";

import "../css/styles.css";

export default function Settings() {
  function clearStorage() {
    localStorage.clear();
  }

  return (
    <div>
      <h1>Settings !!</h1>
      <br />
      <br />
      <LoginForm />
      <br />
      <EnablePush />
      <br />
      <p>
        This data is saved to your browser, and is not logged anywhere else. Do
        not use if you do not trust the device your are using. Your information
        is is accessed by the flex2 api only when car booking attempts are
        requested.
      </p>
      <br />

      <span
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={clearStorage}
      >
        Clear storage
      </span>
    </div>
  );
}
