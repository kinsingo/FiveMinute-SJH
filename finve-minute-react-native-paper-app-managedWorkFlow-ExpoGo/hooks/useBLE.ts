/* eslint-disable no-bitwise */
import { useState, useMemo } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import { BleManager, Device } from "react-native-ble-plx";

// iBeacon UUID 및 Major/Minor 정보
const IBEACON_UUID = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
const MAJOR = 40011;
const MINOR_GANGNAM = 53181;
const MINOR_BUNDANG = 53192;

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  console.log("detectedLocation : " + detectedLocation);
  console.log("allDevices : " + allDevices);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Bluetooth Scan Permission",
        message: "App requires Bluetooth Scanning",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Bluetooth Connect Permission",
        message: "App requires Bluetooth Connecting",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "App requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return await requestAndroid31Permissions();
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const parseIBeaconData = (manufacturerData: string) => {
    if (!manufacturerData) return null;

    // iBeacon 데이터는 최소 22바이트 이상
    if (manufacturerData.length < 22) return null;

    const buffer = Buffer.from(manufacturerData, "base64");

    return {
      uuid: buffer.slice(2, 18).toString("hex").toUpperCase(),
      major: buffer.readUInt16BE(18),
      minor: buffer.readUInt16BE(20),
      rssi: buffer.readInt8(21),
    };
  };

  const scanForPeripherals = () => console.log("🔍 Scanning for iBeacons...");
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log(error);
    }

    if (device?.manufacturerData) {
      const parsedData = parseIBeaconData(device.manufacturerData);
      console.log("parsedIBeaconData:" + parsedData);

      if (parsedData && parsedData.uuid.toUpperCase() === IBEACON_UUID) {
        console.log(
          `✅ iBeacon Found: UUID=${parsedData.uuid}, Major=${parsedData.major}, Minor=${parsedData.minor}`
        );

        // 특정 Minor 값에 따라 장소 감지
        if (parsedData.major === MAJOR) {
          if (parsedData.minor === MINOR_GANGNAM) {
            setDetectedLocation("🏙️ Gangnam");
          } else if (parsedData.minor === MINOR_BUNDANG) {
            setDetectedLocation("🏢 Bundang");
          }
        }

        if (device && (device.localName === "Arduino" || device.name === "Arduino")) {
          setAllDevices((prevState: Device[]) => {
            if (!isDuplicteDevice(prevState, device)) {
              return [...prevState, device];
            }
            return prevState;
          });
        }
      }
    }
  });


  return {
    allDevices,
    requestPermissions,
    scanForPeripherals,
  };
}

export default useBLE;
