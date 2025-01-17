import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Link} from 'expo-router';

const Page = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>수내점 재고 업데이트</Text>
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

export default Page;