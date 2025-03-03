import React from "react";
import { Card } from "react-native-paper";
import ToDoImage from "@/components/todo/detail-instruction-page/components/todo-image";
import DetailTextInput from "@/components/todo/detail-instruction-page/components/todo-detail-textinput";
import MainText from "@/components/todo/detail-instruction-page/components/main-text";

interface InstructionDetailScreenProps {
  isEditing: boolean;
  details: string; 
  setDetails: (details: string) => void;
  title: string;
  author: string;
  timestamp: string;
  imageUrl: string;
}

export default function TodoDetailCard({isEditing, details, setDetails, title, author, timestamp, imageUrl}: InstructionDetailScreenProps) {
  return (
    <Card mode="elevated">
      <Card.Content>
        <MainText
          title={title as string}
          author={author as string}
          timestamp={timestamp as string}
        />
        <DetailTextInput isEditing={isEditing} details={details} setDetails={setDetails} />
        <ToDoImage imageUrl={imageUrl as string} />
      </Card.Content>
    </Card>
  );
}
