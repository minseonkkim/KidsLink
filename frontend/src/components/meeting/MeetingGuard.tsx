import { Navigate } from "react-router-dom"
import { useParentInfoStore } from "../../stores/useParentInfoStore"

export function MeetingGuard({ children }: { children: JSX.Element }) {
  const { hasAccessedMeeting } = useParentInfoStore()

  if (!hasAccessedMeeting) {
    // 사용자가 MeetingList를 통해서 접근하지 않았다면 입장불가
    return <Navigate to="/meeting" />
  }

  return children
}
