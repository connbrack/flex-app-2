import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import EnablePush from "./EnablePush";
import { useToast } from "@chakra-ui/react";

function MainForm() {
  const [settings, setSettings] = useState({
    CommunautoEmail: "",
    CommunautoPassword: "",
    City: "montreal",
    DefaultDistance: 0.5,
    DefaultEthicalMode: true,
  });


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
  }

  const toast = useToast();
  function showToast(title, description) {
    toast({
      title: title,
      description: description,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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
        <br />
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
        <button
          className="button"
          onClick={(e) => {
            e.preventDefault();
            setBrowserData();
            showToast("Saved", "Settings saved");
          }}
        >
          Save
        </button>
        <br /> <br />
        <h3>Notifications</h3>
        <EnablePush />
        <br /> <br />
        <h3>Default settings</h3>
        <h6>(coming soon)</h6>
        <Form.Group className="mb-3" controlId="selectCity">
          <Form.Label>Select city</Form.Label>
          <Form.Select
            name="City"
            value={settings.City}
            onChange={(e) => handleFormChange(e)}
            disabled={true}
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
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            name="DefaultEthicalMode"
            checked={settings.DefaultEthicalMode}
            label="Ethical mode enabled by default"
            onChange={(e) => handleFormChange(e)}
            disabled={true}
          />
        </Form.Group>
      </Form>
      <br />
    </div>
  );
}

export default MainForm;
