import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Inventory() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.push("/inventory/Gangnam/update")}>
        <Text style={styles.link}>강남점 - 재고 업데이트</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/inventory/Gangnam/status')}>
        <Text style={styles.link}>강남점 - 재고 상태</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/inventory/Bundang/update')}>
        <Text style={styles.link}>수내점 - 재고 업데이트</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/inventory/Bundang/status')}>
        <Text style={styles.link}>수내점 - 재고 상태</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 10,
  },
});
