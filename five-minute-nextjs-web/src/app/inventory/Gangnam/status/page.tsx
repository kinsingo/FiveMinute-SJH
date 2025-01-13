import StatusPage from "@/app/inventory/components/status/statusPage";

export default async function Status() {
  return (
    <StatusPage
      collectionName="inventory-status-gangnam"
      mainText="강남역점 재고 상태"
      color="info"
      fetchDeleteDataPath="/api/inventory/Gangnam"

    />
  );
}
