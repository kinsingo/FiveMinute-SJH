import React, { useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import {View} from "react-native";
import {AuthContextType} from "@/store/context/AuthContext";

interface AccountDeletionDialogProps {
  auth: AuthContextType;
  setLoading: (loading: boolean) => void;
  setActionMessage: (message: { success: boolean; message: string; subMessage: string }) => void;
}

export default function AccountDeletionDialog({
  auth,
  setLoading,
  setActionMessage,
}: AccountDeletionDialogProps) {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const handleDelete = async () => {
    hideDialog();
    try {
      setLoading(true);
      await auth.delete();
      setActionMessage({
        success: true,
        message: "계정 삭제 성공",
        subMessage: "",
      });
    } catch (error: any) {
      setActionMessage({
        success: false,
        message: "계정 삭제 실패",
        subMessage: error.message || "",
      });
    } finally {
      setLoading(false);
      await auth.logout();
    }
  };

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text variant="bodyMedium">계정을 삭제하시겠습니까?</Text>
        <Button mode="text" onPress={showDialog}>
          삭제하기
        </Button>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>계정 삭제</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">정말로 삭제하시겠습니까?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>아니요</Button>
            <Button onPress={handleDelete}>네</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
