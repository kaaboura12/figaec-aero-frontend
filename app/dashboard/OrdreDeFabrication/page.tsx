import type { Metadata } from "next";
import {
  MOCK_ORDERS,
  TOTAL_OF_COUNT,
  ALL_DEPARTMENTS,
  ALL_WORKSTATIONS,
  ALL_CHAINS,
} from "@/lib/data/orders";
import OrdersView from "@/components/orders/OrdersView";

export const metadata: Metadata = {
  title: "Ordres de fabrication | Figeac Aero Tunisie",
};

export default function OrdreDeFabricationPage() {
  return (
    <OrdersView
      orders={MOCK_ORDERS}
      totalCount={TOTAL_OF_COUNT}
      departments={ALL_DEPARTMENTS}
      workstations={ALL_WORKSTATIONS}
      chains={ALL_CHAINS}
    />
  );
}
