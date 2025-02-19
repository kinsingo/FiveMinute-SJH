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

// 안드로이드에서는, BLE 스캔을 통해 찾은 디바이스의 ID를 통해 유효한 디바이스인지 확인
// iOS에서는, 디바이스의 이름만 가지고 유효한 디바이스인지 확인 (필요시 추후 다른 방법 고안, 근데 솔직히 누가 비콘 새로 사서 조작할거 같지는 않음)
// iOS에서는 ID를 확인할 수 없음, 보안 정책상 MAC Address 가 임의의 uuid로 변경되어 있음, 헤당 uuid는 계속 바뀔수 있는거라 사용 불가
function IsVlaidIDType(id: string) {
  console.log("id:" + id);

  if(Platform.OS === "ios") return true;
  if (id === "C3:00:00:3F:38:DD") return true; //5minGN
  if (id === "C3:00:00:3F:38:D2") return true; //5minSN
  if (id === "C3:00:00:3F:37:4B") return true; //5minSL
  return false;
}

export function useScanBLEs() {
  const [isScanning, setIsScanning] = useState(false);
  const validBeaconNameRef = useRef<validIbeaconE7Name>("5minSN"); // ✅ 최신값 유지
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

    handlePermissions();

    return () => {
      console.debug("[app] main component unmounting. Removing listeners...");
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  const handlePermissions = () => {
    if (Platform.OS === "ios") {
      BleManager.enableBluetooth()
        .then(() => console.log("✅ Bluetooth enabled"))
    } 
    else if (Platform.OS === "android" && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,//이거 꼭 필요함..! 없으면 안됨 (내가 ibeacon 스캔 필요하기 때문)
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

  return { IsVaidArea, setValidBeaconName };
}
