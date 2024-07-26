import { logout } from "../../api/member"

export default function LogoutButton() {
  return (
    <button onClick={() => logout()}>로그아웃</button>
  )
}

