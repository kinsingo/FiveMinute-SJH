import { useFormStatus } from "react-dom";//npm install --save-dev @types/react@latest @types/react-dom@latest 이렇게 해야만 build 에서 사용 가능함
import MKButton from "@/MKcomponents/MKButton";

interface FormSubmitProps {
  pendingText: string;
  buttonText: string;
  color:MUIColor;
}

export default function FormSubmit({
  pendingText,
  buttonText,
  color,
}: FormSubmitProps) {
  const status = useFormStatus();

  if (status.pending) {
    return (
      <MKButton color={color} fullWidth disabled>
        {pendingText}
      </MKButton>
    );
  }

  return (
    <>
      <MKButton type="submit" variant="gradient" color={color} fullWidth>
        {buttonText}
      </MKButton>
    </>
  );
}
