import spinnerImage from '../../assets/common/loading-spinner.png';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50">
      <img
        src={spinnerImage}
        alt="Loading..."
        className="animate-spin w-20"
      />
    </div>
  );
}
