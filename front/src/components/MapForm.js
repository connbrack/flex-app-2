import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import Spinner from "react-bootstrap/Spinner";
import "../css/styles.css";
import "../css/checkbox.css";
import { useToast } from "@chakra-ui/react";

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
  const [settings, setSettings] = useState({
    CommunautoEmail: "",
    CommunautoPassword: "",
    City: "montreal",
    DefaultDistance: 0.5,
    DefaultEthicalMode: true,
  });

  const toast = useToast();
  function showToast(title, description, status, duration) {
    toast({
      title: title,
      description: description,
      status: status,
      duration: duration,
      isClosable: true,
    });
  }

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
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          const payload = {
            latLong: latLong,
            radius: pickerValue["radius"],
            ethicalMode: document.getElementById("ethicalMode").checked,
            pushSubscription: subscription,
            ...settings,
          };
          fetch(`/api/request_booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
            .then((response) => {
              showToast(
                "Request sent",
                "You will receive a confirmation notification shortly",
                "success", 2000
              );
            })
            .catch(() => {
              showToast(
                "Dammit !!",
                "Something seems to have gone wrong on our side",
                "error", 2000
              );
            });
        } else {
          showToast(
            "To soon junior",
            "You are not subscribed to push notifications, make sure you go to the settings before using this app.",
            "error", 10000
          );
          throw new Error("User is not subscribed to push notification");
        }
      });
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

        <div className="checkbox-wrapper-35">
          <input
            className="switch"
            type="checkbox"
            id="ethicalMode"
            name="switch"
            value="private"
          />
          <label htmlFor="ethicalMode">
            <span className="switch-x-text">Ethical mode is </span>
            <span className="switch-x-toggletext">
              <span className="switch-x-unchecked">
                <span className="switch-x-hiddenlabel">Unchecked: </span>Off
              </span>
              <span className="switch-x-checked">
                <span className="switch-x-hiddenlabel">Checked: </span>On
              </span>
            </span>
          </label>
        </div>

        <button
          className="button"
          disabled={!geoFound}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Send request
        </button>
      </div>
    </div>
  );
};

export default MapForm;
