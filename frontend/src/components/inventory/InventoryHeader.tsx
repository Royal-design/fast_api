import { Boxes, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type InventoryHeaderProps = {
  isLoading: boolean;
  onRefresh: () => void;
};

export function InventoryHeader({ isLoading, onRefresh }: InventoryHeaderProps) {
  return (
    <header className="inventory-header">
      <div>
        <div className="eyebrow">
          <Boxes className="size-4" />
          Product inventory
        </div>
        <h1>Stock control</h1>
        <p>Manage products from your FastAPI backend.</p>
      </div>

      <Button type="button" variant="outline" onClick={onRefresh} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
        Refresh
      </Button>
    </header>
  );
}
