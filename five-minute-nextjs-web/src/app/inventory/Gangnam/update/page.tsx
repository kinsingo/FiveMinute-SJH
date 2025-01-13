import UpdatePage from "@/app/inventory/components/update/updatePage";

export default async function Update() {
  return (
    <UpdatePage
      collectionName="inventory-status-gangnam"
      mainText="강남역점 재고 업데이트"
      color="info"
      redirectPathAfterSuccessfulUpdate="/inventory/Gangnam/status"
      fetchPreviousDataPath="/api/inventory/Gangnam"
    />
  );
}
