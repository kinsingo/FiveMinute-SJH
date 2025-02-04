import UpdateModule, { DocumentProp } from "@/components/inventory/components/update/updateModule";
import { useInventoryRecentItems } from "@/hooks/useInventoryRecentItems";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import React from "react";
import { Href } from "expo-router";

export default function UpdateFinalModule({
  inventoryURL,
  redirectPathAfterSuccessfulUpdate,
}: {
  inventoryURL: string;
  redirectPathAfterSuccessfulUpdate: Href;
}) {
  const { inventoryData, currentUserEmail, loading, reload } =
    useInventoryRecentItems(inventoryURL);
  if (loading) {
    return <MyActivityIndicator />;
  }

  const document: DocumentProp = {
    inventoryData: inventoryData,
    redirectPathAfterSuccessfulUpdate: redirectPathAfterSuccessfulUpdate,
    currentUserEmail: currentUserEmail,
    uploadURL: inventoryURL,
  };

  return <UpdateModule document={document} reload={reload} />;
}
