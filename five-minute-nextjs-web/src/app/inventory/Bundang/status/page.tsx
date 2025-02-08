import StatusPage from "@/app/inventory/components/status/statusPage";

import {InventoryCollectionName} from "@/MongoDB/db-manager";

export default async function Status() {
  return (
    <StatusPage
      collectionName={InventoryCollectionName.bundang}
      mainText="분당 수내역점 재고 상태"
      color="warning"
      fetchDeleteDataPath="/api/inventory/Bundang"
    />
  );
}
