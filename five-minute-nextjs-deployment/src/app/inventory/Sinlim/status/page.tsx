import StatusPage from "@/app/inventory/components/status/statusPage";

import {InventoryCollectionName} from "@/MongoDB/db-manager";

export default async function Status() {
  return (
    <StatusPage
      collectionName={InventoryCollectionName.sinlim}
      mainText="관악점 재고 상태"
      color="success"
      fetchDeleteDataPath="/api/inventory/Sinlim"
    />
  );
}
