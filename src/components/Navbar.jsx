// components/Sidebar.js
function Sidebar() {
  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="px-5 py-5">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <ul className="space-y-2">
        <li className="px-5 py-2 hover:bg-gray-700">Home</li>
        <li className="px-5 py-2 hover:bg-gray-700">Settings</li>
        <li className="px-5 py-2 hover:bg-gray-700">Profile</li>
      </ul>
    </div>
  );
}

export default Sidebar;
