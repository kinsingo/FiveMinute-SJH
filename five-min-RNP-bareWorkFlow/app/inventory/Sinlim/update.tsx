import UpdateFinalModule from "@/components/inventory/updateFinalModule";

export default function UpdatePage() {
  return (
    <UpdateFinalModule
      inventoryURL="https://www.5minbowl.com/api/inventory/Sinlim"
      redirectPathAfterSuccessfulUpdate="/inventory/Sinlim/status"
    />
  );
}
