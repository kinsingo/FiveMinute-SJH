import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Link} from 'expo-router';

const StackPage2 = () => {
    return (
        <View style={styles.container}>
          <Link href="/(tabs)/stackTest/stackPage3">
            <Text style={styles.text}>This is Stack Page 2</Text>
          </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
});

export default StackPage2;