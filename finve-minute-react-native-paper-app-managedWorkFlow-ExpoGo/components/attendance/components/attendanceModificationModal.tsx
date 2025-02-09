import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Modal,
  Portal,
  useTheme,
  Divider,
} from "react-native-paper";
import TimePickerButton from "./timePickerButton";

interface AttendanceModalProps {
  visible: boolean;
  onStartTimeConfirm: (date: Date) => void;
  onEndTimeConfirm: (date: Date) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AttendanceModificationModal({
  visible,
  onStartTimeConfirm,
  onEndTimeConfirm,
  onSave,
  onCancel,
}: AttendanceModalProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
      >
        <Text variant="headlineSmall" style={{ textAlign: "center" }}>
          출근 및 퇴근 시간 수정
        </Text>
        <Divider style={{ marginVertical: 10 }} />

        <TimePickerButton
          label="출근 시간 선택"
          onConfirm={onStartTimeConfirm}
        />
        <TimePickerButton label="퇴근 시간 선택" onConfirm={onEndTimeConfirm} />
        <View style={styles.modalActions}>
          <Button mode="contained" onPress={onSave} style={styles.button}>
            저장
          </Button>
          <Button mode="outlined" onPress={onCancel} style={styles.button}>
            취소
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  button: {
    marginVertical: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});
