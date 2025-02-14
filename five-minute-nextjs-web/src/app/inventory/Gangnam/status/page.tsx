import StatusPage from "@/app/inventory/components/status/statusPage";

import {InventoryCollectionName} from "@/MongoDB/db-manager";

export default async function Status() {
  return (
    <StatusPage
      collectionName={InventoryCollectionName.gangnam}
      mainText="강남역점 재고 상태"
      color="info"
      fetchDeleteDataPath="/api/inventory/Gangnam"
    />
  );
}
