import StatusFinalModule from "@/components/inventory/statusFinalModule";

export default function Status() {
  return (
    <StatusFinalModule
      statusFetchUrl="https://www.5minbowl.com/api/inventory-status/Sinlim"
      deleteURL="https://www.5minbowl.com/api/inventory/Sinlim"
    />
  );
}
