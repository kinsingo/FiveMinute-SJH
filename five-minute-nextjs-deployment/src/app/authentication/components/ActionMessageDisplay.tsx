import MKTypography from "@/MKcomponents/MKTypography";

interface ActionMessageDisplayProps {
  message?: string;
  sub_message?: string;
}

export default function ActionMessageDisplay({ message, sub_message }:ActionMessageDisplayProps) {
  return (
    <>
      {message && (
        <MKTypography variant="body1" fontWeight="medium" color="errorBright">
          {message}
        </MKTypography>
      )}
      {sub_message && (
        <MKTypography variant="body2" color="errorBrightSecond">
          {sub_message}
        </MKTypography>
      )}
    </>
  );
}
