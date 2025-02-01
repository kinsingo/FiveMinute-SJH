import React from "react";
import StatusModule, {
  DocumentProps,
} from "@/components/inventory/components/status/statusModule";
import { useInventoryItemsMap } from "@/hooks/useInventoryItemsMap";
import { ActivityIndicator } from "react-native-paper";

export default function StatusFinalModule({
  statusFetchUrl,
  deleteURL,
}: {
  statusFetchUrl: string;
  deleteURL: string;
}) {
  const { itemsMap, currentUserEmail, loading, reload } =
    useInventoryItemsMap(statusFetchUrl);

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" animating={true} />
    );
  }

  const documents: DocumentProps = {
    itemsMap: itemsMap,
    fetchDeleteDataPath: deleteURL,
    currentUserEmail: currentUserEmail,
  };

  return <StatusModule documents={documents} onDeleteSuccess={reload} />;
}
