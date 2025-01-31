import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Page = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>강남점 재고 업데이트</Text>
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