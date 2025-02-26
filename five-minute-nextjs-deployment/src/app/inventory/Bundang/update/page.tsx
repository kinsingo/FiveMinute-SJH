import UpdatePage from "@/app/inventory/components/update/updatePage";

import {InventoryCollectionName} from "@/MongoDB/db-manager";

export default async function Update() {
  return (
    <UpdatePage
      collectionName={InventoryCollectionName.bundang}
      mainText="분당 수내역점 재고 업데이트"
      color="warning"
      redirectPathAfterSuccessfulUpdate="/inventory/Bundang/status"
      fetchPreviousDataPath="/api/inventory/Bundang"
    />
  );
}
