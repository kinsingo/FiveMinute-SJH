"use client"; //for onClick event

// @mui material components
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";

// Material Kit 2 PRO React components
import MKBox from "@/MKcomponents/MKBox";
import MKButton from "@/MKcomponents/MKButton";
import MKTypography from "@/MKcomponents/MKTypography";

interface ConfirmModalProps {
  isModalOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  content?: string;
}

export default function ConfirmModal({
  isModalOpen,
  onConfirm,
  onClose,
  title = "Are you sure?",
  content = "You can't undo this action",
}: ConfirmModalProps) {
  return (
    <MKBox component="section" py={6}>
      <Container>
        <Modal
          open={isModalOpen}
          onClose={onClose}
          sx={{ display: "grid", placeItems: "center" }}
        >
          <Slide direction="down" in={isModalOpen} timeout={500}>
            <MKBox
              position="relative"
              width="500px"
              display="flex"
              flexDirection="column"
              borderRadius="xl"
              bgColor="white"
              shadow="xl"
            >
              <MKBox
                display="flex"
                alginItems="center"
                justifyContent="space-between"
                p={2}
              >
                <MKTypography variant="h5">{title}</MKTypography>
                <CloseIcon
                  fontSize="medium"
                  sx={{ cursor: "pointer" }}
                  onClick={onClose}
                />
              </MKBox>
              <MKBox p={2}>
                <MKTypography
                  variant="body2"
                  color="secondary"
                  fontWeight="regular"
                >
                  {content}
                </MKTypography>
              </MKBox>
              <Divider sx={{ my: 0 }} />
              <MKBox display="flex" justifyContent="right" gap={2} p={1.5}>
                <MKButton variant="gradient" color="dark" onClick={onClose}>
                  close
                </MKButton>
                <MKButton
                  variant="gradient"
                  color="primary"
                  onClick={onConfirm}
                >
                  save changes
                </MKButton>
              </MKBox>
            </MKBox>
          </Slide>
        </Modal>
      </Container>
    </MKBox>
  );
}
