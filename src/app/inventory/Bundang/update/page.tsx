import UpdatePage from "@/app/inventory/components/update/updatePage";

export default async function Update() {
  return (
    <UpdatePage
      collectionName="inventory-status-bundang"
      mainText="분당 수내역점 재고 업데이트"
      color="warning"
      redirectPathAfterSuccessfulUpdate="/inventory/Bundang/status"
      fetchPreviousDataPath="/api/inventory/Bundang"
    />
  );
}
