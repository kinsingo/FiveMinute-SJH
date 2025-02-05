import React, { useState } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import SaveButton from "@/components/todo/new-instruction-page/save-button";
import EditableCard from "@/components/todo/new-instruction-page/editable-card";
import { LocationProp } from "@/components/todo/instruction-db-manager";

export default function NewInstructionModule({ Location }: { Location: LocationProp }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [IsSaving, setIsSaving] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, padding: 16 }}>
        <EditableCard
          title={title}
          details={details}
          imageUrl={imageUrl}
          IsSaving={IsSaving}
          setTitle={setTitle}
          setDetails={setDetails}
          setImageUrl={setImageUrl}
        />
        <SaveButton
          title={title}
          details={details}
          imageUrl={imageUrl}
          IsSaving={IsSaving}
          setIsSaving={setIsSaving}
          Location={Location}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
