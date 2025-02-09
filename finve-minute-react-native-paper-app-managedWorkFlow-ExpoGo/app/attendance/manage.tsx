
import {Text} from "react-native-paper"
import {StyleSheet, View} from "react-native"

export default function Manage() {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Attendance Manage Page</Text>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            fontSize: 20,
        },
    });