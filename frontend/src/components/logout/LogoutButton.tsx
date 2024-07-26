import { logout } from "../../api/member";
import { setAuthorizationToken } from "../../api/token/axiosInstance";

export default function LogoutButton() {
  return (
    <div className="space-y-2">
      <button className="bg-red-300 px-4 py-2 rounded" onClick={() => logout()}>
        로그아웃
      </button>
      <button className="bg-blue-300 px-4 py-2 rounded" onClick={() => setAuthorizationToken()}>
        토큰 재발급
      </button>
    </div>
  );
}
