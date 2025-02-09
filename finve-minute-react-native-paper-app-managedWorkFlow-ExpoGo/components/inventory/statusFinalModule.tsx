import React from "react";
import StatusModule, { DocumentProps } from "@/components/inventory/components/status/statusModule";
import { useInventoryItemsMap } from "@/hooks/useInventoryItemsMap";
import MyActivityIndicator from "@/components/MyActivityIndicator";

export default function StatusFinalModule({
  statusFetchUrl,
  deleteURL,
}: {
  statusFetchUrl: string;
  deleteURL: string;
}) {
  const { itemsMap, currentUserEmail, loading, reload } = useInventoryItemsMap(statusFetchUrl);

  if (loading) {
    return <MyActivityIndicator />;
  }

  const documents: DocumentProps = {
    itemsMap: itemsMap,
    fetchDeleteDataPath: deleteURL,
    currentUserEmail: currentUserEmail,
  };

  return <StatusModule documents={documents} onDeleteSuccess={reload} />;
}
