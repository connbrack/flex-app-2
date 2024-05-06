import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function MainForm() {
  const [settings, setSettings] = useState({
    FlexKey: "",
    PushKey: "",
    CommunautoEmail: "",
    CommunautoPassword: "",
    City: "montreal",
    DefaultDistance: 0.5,
    DefaultEthicalMode: true,
  });

  const [showModal, setShowModal] = useState(false);

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSettings((settings) => ({
        ...settings,
        [name]: checked,
      }));
    } else {
      setSettings((settings) => ({
        ...settings,
        [name]: value,
      }));
    }
    console.log(settings.DefaultEthicalMode);
  }

  function getBrowserData() {
    if (localStorage.getItem("FlexApp-Settings") != null) {
      setSettings(JSON.parse(localStorage.getItem("FlexApp-Settings")));
    } else {
      setSettings(settings);
    }
  }

  function setBrowserData() {
    localStorage.setItem("FlexApp-Settings", JSON.stringify(settings));
  }

  useEffect(() => {
    getBrowserData();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Form data-bs-theme="dark">
        <Form.Group className="mb-3" controlId="CommunautoPassword">
          <Form.Label>Select city</Form.Label>
          <Form.Select
            name="City"
            value={settings.City}
            onChange={(e) => handleFormChange(e)}
          >
            <option>Select a city</option>
            <option value="montreal">Montreal</option>
            <option value="toronto">Toronto</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="DefaultDistance">
          <Form.Label>Default Distance</Form.Label>
          <Form.Control
            type="number"
            min={0.1}
            max={5}
            step={0.1}
            name="DefaultDistance"
            placeholder="Distance"
            value={settings.DefaultDistance}
            onChange={(e) => handleFormChange(e)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            name="DefaultEthicalMode"
            checked={settings.DefaultEthicalMode}
            label="Ethical mode enabled by default"
            onChange={(e) => handleFormChange(e)}
          />
        </Form.Group>
        <br />

        <h3>Login info</h3>

        <Form.Group className="mb-3" controlId="CommunautoEmail">
          <Form.Label>Communauto ID</Form.Label>
          <Form.Control
            type="email"
            name="CommunautoEmail"
            placeholder="name@example.com"
            value={settings.CommunautoEmail}
            onChange={(e) => handleFormChange(e)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="CommunautoPassword">
          <Form.Label>Communauto Password</Form.Label>
          <Form.Control
            type="password"
            name="CommunautoPassword"
            placeholder=""
            value={settings.CommunautoPassword}
            onChange={(e) => handleFormChange(e)}
          />
        </Form.Group>
        <br />

        <h3>Api keys</h3>

        <Form.Group className="mb-3" controlId="FlexAppApiKey">
          <Form.Label>FlexApp Api Key</Form.Label>
          <Form.Control
            type="text"
            name="FlexKey"
            placeholder="api key"
            value={settings.FlexKey}
            onChange={(e) => handleFormChange(e)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="PushApiKey">
          <Form.Label>Push API key</Form.Label>
          <Form.Control
            type="text"
            name="PushKey"
            placeholder="api key"
            value={settings.PushKey}
            onChange={(e) => handleFormChange(e)}
          />
        </Form.Group>
        <br />

        <button
          className="button"
          onClick={(e) => {
            e.preventDefault();
            setBrowserData();
            setShowModal(true);
          }}
        >
          Save
        </button>
      </Form>
      <br />
      <br />
      <Modal
        data-bs-theme="dark"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Settings saved</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, your settings are saved!</Modal.Body>
        <Modal.Footer>
          <button className="button" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MainForm;