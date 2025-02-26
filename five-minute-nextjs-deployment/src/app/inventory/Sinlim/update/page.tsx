import UpdatePage from "@/app/inventory/components/update/updatePage";
import {InventoryCollectionName} from "@/MongoDB/db-manager";

export default async function Update() {
  return (
    <UpdatePage
      collectionName={InventoryCollectionName.sinlim}
      mainText="관악점 재고 업데이트"
      color="success"
      redirectPathAfterSuccessfulUpdate="/inventory/Sinlim/status"
      fetchPreviousDataPath="/api/inventory/Sinlim"
    />
  );
}
