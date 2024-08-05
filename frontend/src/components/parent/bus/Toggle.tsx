export const Toggle = ({ isOn, toggleHandler }) => {
  return (
    <div className="fixed flex items-center ml-8 space-x-2 mt-4">
      <div
        className={`relative cursor-pointer w-10 h-6 rounded-full ${
          isOn ? 'bg-[#75A47F]' : 'bg-gray-300'
        }`}
        onClick={toggleHandler}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
            isOn ? 'transform translate-x-6' : ''
          }`}
        />
      </div>
      <div className="text-base font-medium text-gray-700">
        {isOn ? '탑승 예정' : '탑승 안함'}
      </div>
    </div>
  );
};
