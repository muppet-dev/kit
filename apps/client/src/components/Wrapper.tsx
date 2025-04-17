import Sidebar from "./Sidebar";
import Tabs from "./Tabs";

export default function Wrapper() {
  return (
    <div>
      <Sidebar />
      <div className="flex flex-col w-full h-full">
        <Tabs />
      </div>
    </div>
  );
}
