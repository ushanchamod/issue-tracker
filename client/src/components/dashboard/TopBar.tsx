import Button from "../ui/Button";

const TopBar = () => {
  return (
    <div className="flex flex-row items-center justify-between p-3 bg-gray-900 fixed top-0 left-0 w-full z-2">
      <p className="text-white text-lg font-medium">Issue Management</p>
      <div>
        <Button
          activeText="Add new Issue"
          className="bg-white text-black rounded-sm px-7 py-1 cursor-pointer text-sm"
        />
      </div>
    </div>
  );
};

export default TopBar;
