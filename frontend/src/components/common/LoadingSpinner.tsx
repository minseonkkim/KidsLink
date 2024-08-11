import spinnerImage from '../../assets/common/loading-spinner.png';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <img
        src={spinnerImage}
        alt="Loading..."
        className="animate-spin w-20"
      />
    </div>
  );
}
