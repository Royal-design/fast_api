import "./App.css";
import { Toaster } from "./components/ui/sonner";
import { InventoryPage } from "./components/inventory/InventoryPage";

function App() {
  return (
    <>
      <InventoryPage />
      <Toaster richColors />
    </>
  );
}

export default App;
