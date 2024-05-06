import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "../css/styles.css";
import "../css/checkbox.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapForm = () => {
  const [latLong, setLatLong] = useState([45.508, -73.561]);
  const [geoFound, setGeoFound] = useState();
  const [pickerValue, setPickerValue] = useState({ radius: 0.5 });
  const [ethicalMode, setEthicalMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [settings, setSettings] = useState({
    FlexKey: '',
    PushKey: '',
    CommunautoEmail: '',
    CommunautoPassword: '',
    City: 'montreal',
    DefaultDistance: 0.5,
    DefaultEthicalMode: true,
  });

  const selections = {
    radius: Array(51)
      .fill(1)
      .map((_, i) => i / 10),
  };

  function getBrowserData() {
    if (localStorage.getItem("FlexApp-Settings") != null) {
      setSettings(JSON.parse(localStorage.getItem("FlexApp-Settings")));
    } else {
      setSettings(settings);
    }
    setEthicalMode(settings.DefaultEthicalMode);
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setLatLong([latitude, longitude]);
          setGeoFound(true);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  const icon = new L.Icon({
    iconUrl: require("../images/car-icon.png"),
    iconSize: [30, 30],
  });

  function MyMapEvents() {
    const map = useMapEvents({
      move: () => {
        setLatLong([map.getCenter().lat, map.getCenter().lng]);
      },
    });
    return null;
  }

  function handleSubmit() {
    const payload = {
      latLong: latLong,
      radius: pickerValue["radius"],
      ethicalMode: document.getElementById("ethicalMode").checked,
      ...settings,
    };

    fetch(`/api/request_booking`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          setShowModalError(true);
        }
        setShowModal(true);
      })
      .catch(() => {
        setShowModalError(true);
      });
  }

  useEffect(() => {
    getBrowserData();
    getUserLocation();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="map-div">
        {geoFound ? (
          <MapContainer
            center={latLong}
            zoom={Math.floor(14.1 + -1.44 * Math.log(pickerValue["radius"]))}
            style={{ height: "300px", width: "300px" }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <Circle
              center={latLong}
              radius={pickerValue["radius"] * 1000}
              animation={true}
              color="#F15B2C"
              fillColor="#2B3035"
            />
            <Marker position={latLong} icon={icon}></Marker>
            <MyMapEvents />
          </MapContainer>
        ) : (
          <div className="map-loading-square">
            <Spinner
              animation="border"
              role="status"
              variant="primary"
              style={{ margin: "auto" }}
            ></Spinner>
          </div>
        )}
      </div>

      <div>
        <Picker height={170} value={pickerValue} onChange={setPickerValue}>
          {Object.keys(selections).map((name) => (
            <Picker.Column key={name} name={name}>
              {selections[name].map((option) => (
                <Picker.Item key={option} value={option}>
                  {option + " km"}
                </Picker.Item>
              ))}
            </Picker.Column>
          ))}
        </Picker>

        <div class="checkbox-wrapper-35">
          <input
            className="switch"
            type="checkbox"
            id="ethicalMode"
            name="switch"
            checked={ethicalMode}
            onClick={() => setEthicalMode(setEthicalMode(!ethicalMode))}
            value="private"
          />
          <label for="switch">
            <span class="switch-x-text">Ethical mode is </span>
            <span class="switch-x-toggletext">
              <span class="switch-x-unchecked">
                <span class="switch-x-hiddenlabel">Unchecked: </span>Off
              </span>
              <span class="switch-x-checked">
                <span class="switch-x-hiddenlabel">Checked: </span>On
              </span>
            </span>
          </label>
        </div>

        <button
          className="button"
          disabled={!geoFound}
          onClick={() => handleSubmit()}
        >
          Send request
        </button>

        <Modal
          data-bs-theme="dark"
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Search Started !!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="main-container">
              <figure className="figure">
                <img alt="" src="favicon.ico" />
              </figure>
              Woohoo, we're finding a car for you !!
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="button" onClick={() => setShowModal(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          data-bs-theme="dark"
          show={showModalError}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Fuck !!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="main-container">
              Something went wrong, plz tell me what happened !
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="button" onClick={() => setShowModalError(false)}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default MapForm;
