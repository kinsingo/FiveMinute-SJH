import ListOfAttendance, { Attendance } from "../../components/attendance/listOfAttendance";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
//import DeviceModal from "@/components/todo/DeviceConnectionModal";
//import useBLE from "@/hooks/useBLE";

export default function main() {
  // const { requestPermissions, scanForPeripherals, allDevices } = useBLE();
  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // const scanForDevices = async () => {
  //   const isPermissionsEnabled = await requestPermissions();
  //   if (isPermissionsEnabled) {
  //     scanForPeripherals();
  //   }
  // };

  // const hideModal = () => {
  //   setIsModalVisible(false);
  // };

  // const openModal = async () => {
  //   scanForDevices();
  //   setIsModalVisible(true);
  // };

  return  <ListOfAttendance attendanceList={DummyAttendanceList} />;
    {/*<SafeAreaView style={styles.container}>
       <View style={styles.heartRateTitleWrapper}>
        <Text style={styles.heartRateTitleText}>Please Connect to a Heart Rate Monitor</Text>
      </View>
      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{"Connect"}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={() => {}}
        devices={allDevices}
      /> 
    </SafeAreaView>*/}
  
};

const DummyAttendanceList: Attendance[] = [
  {
    start: new Date("2023-10-01T08:00:00"),
    end: new Date("2023-10-01T17:00:00"),
  },
  {
    start: new Date("2023-10-02T08:30:00"),
    end: new Date("2023-10-02T17:30:00"),
  },
  {
    start: new Date("2023-10-03T09:00:00"),
    end: new Date("2023-10-03T18:00:00"),
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});


