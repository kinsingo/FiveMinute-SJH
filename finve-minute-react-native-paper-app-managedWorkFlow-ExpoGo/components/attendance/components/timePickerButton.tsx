import React, { useState } from "react";
import { Button } from "react-native-paper";
import DateTimePicker from "react-native-modal-datetime-picker";

interface TimePickerButtonProps {
  label: string;
  onConfirm: (date: Date) => void;
}

export default function TimePickerButton({ label, onConfirm }: TimePickerButtonProps) {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  return (
    <>
      <Button mode="text" onPress={showPicker}>
        {label}
      </Button>
      <DateTimePicker
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={(date) => {
          onConfirm(date);
          hidePicker();
        }}
        onCancel={hidePicker}
      />
    </>
  );
}
