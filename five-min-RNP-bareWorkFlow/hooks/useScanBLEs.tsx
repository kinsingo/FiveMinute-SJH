/**
 * Sample BLE React Native App
 */
import { useState, useEffect, useRef } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from "react-native-ble-manager";

const SECONDS_TO_SCAN_FOR = 3; //3초간 Scan 진행
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

declare module "react-native-ble-manager" {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

export type validIbeaconE7Name = "5minGN" | "5minSN" | "5minSL";
function IsVlaidIDType(id: string) {
  if (id === "C3:00:00:3F:38:DD") return true; //5minGN
  if (id === "C3:00:00:3F:38:D2") return true; //5minSN
  if (id === "5minSL TBD") return true; //5minSL
  return false;
}

export function useScanBLEs() {
  const [isScanning, setIsScanning] = useState(false);
  const validBeaconNameRef = useRef<validIbeaconE7Name>("5minGN"); // ✅ 최신값 유지
  const peripheralsRef = useRef(new Map<Peripheral["id"], Peripheral>()); // 최신 상태 유지용 Ref
  
  async function startScan() {
    peripheralsRef.current.clear();
    if (!isScanning) {
      try {
        console.debug("[startScan] starting scan...");
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug("[startScan] scan promise returned successfully.");
          })
          .catch((err: any) => {
            console.error("[startScan] ble scan returned in error", err);
          });
      } catch (error) {
        console.error("[startScan] ble scan error thrown", error);
      }
    }
  }

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug("[handleStopScan] scan is stopped.");
  };

  const handleDiscoverPeripheral = async (peripheral: Peripheral) => {
    if (!peripheral.name) {
      peripheral.name = "NO NAME";
    }
    if (peripheral.name?.trim() === validBeaconNameRef.current && IsVlaidIDType(peripheral.id)) {
      console.debug(
        `✅ Found valid peripheral: ${peripheral.name}, validBeaconName: ${validBeaconNameRef.current}
        , ValidID: ${peripheral.id}`
      );
      peripheralsRef.current.set(peripheral.id, peripheral);
    }
  };

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.debug("BleManager started."))
        .catch((error: any) => console.error("BeManager could not be started.", error));
    } catch (error) {
      console.error("unexpected error starting BleManager.", error);
      return;
    }

    const listeners: any[] = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
    ];

    handleAndroidPermissions();
    return () => {
      console.debug("[app] main component unmounting. Removing listeners...");
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  const handleAndroidPermissions = () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then((result) => {
        if (result) {
          console.debug("[handleAndroidPermissions] User accepts runtime permissions android 12+");
        } else {
          console.error("[handleAndroidPermissions] User refuses runtime permissions android 12+");
        }
      });
    } else if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
        (checkResult) => {
          if (checkResult) {
            console.debug("[handleAndroidPermissions] runtime permission Android <12 already OK");
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
              (requestResult) => {
                if (requestResult) {
                  console.debug(
                    "[handleAndroidPermissions] User accepts runtime permission android <12"
                  );
                } else {
                  console.error(
                    "[handleAndroidPermissions] User refuses runtime permission android <12"
                  );
                }
              }
            );
          }
        }
      );
    }
  };

  async function IsVaidArea() {
    const delayForCheck_ms = 1000; // setTimeOut 에서 1000ms 지연 후 BLE 스캔이 완료될 때까지 기다림
    return new Promise<boolean>(async (resolve) => {
      startScan(); // BLE 스캔 시작
      setTimeout(async () => {
        const isValid = peripheralsRef.current.size > 0;
        console.debug(`[IsVaidArea] BLE scan completed. isValid: ${isValid}`);
        resolve(isValid);
      }, SECONDS_TO_SCAN_FOR * 1000 + delayForCheck_ms); // 스캔 시간이 지나고 약간의 지연 후 확인
    });
  }

  const setValidBeaconName = (name: validIbeaconE7Name) => {
    validBeaconNameRef.current = name;
  };

  return { IsVaidArea, setValidBeaconName, isScanning };
}
