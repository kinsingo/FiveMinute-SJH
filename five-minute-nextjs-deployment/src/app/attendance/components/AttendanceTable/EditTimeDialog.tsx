import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

interface EditTimeDialogProps {
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  editTarget: {
    date: string;
    field: "checkIn" | "checkOut";
    value: string;
  } | null;
  setEditTarget: any;
  handleEdit: (
    date: string,
    field: "checkIn" | "checkOut",
    newValue: string[]
  ) => void;
}

export default function EditTimeDialog({
  editDialogOpen,
  setEditDialogOpen,
  editTarget,
  setEditTarget,
  handleEdit,
}: EditTimeDialogProps) {
  return (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
      <DialogTitle>출퇴근 시간 수정</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="HH:MM:SS, HH:MM:SS"
          value={editTarget?.value || ""}
          onChange={(e) =>
            setEditTarget((prev: any) =>
              prev ? { ...prev, value: e.target.value } : null
            )
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>취소</Button>
        <Button
          onClick={() => {
            if (editTarget) {
              const updated = editTarget.value
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v !== "");
              handleEdit(editTarget.date, editTarget.field, updated);
            }
            setEditDialogOpen(false);
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
