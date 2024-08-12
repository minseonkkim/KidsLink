import { Navigate } from "react-router-dom"
import { useParentInfoStore } from "../../stores/useParentInfoStore"
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore"

export function ParentMeetingGuard({ children }: { children: JSX.Element }) {
  const { hasAccessedMeeting } = useParentInfoStore()
      // 사용자가 MeetingList를 통해서 접근하지 않았다면 입장불가
  if (!hasAccessedMeeting) {
    return <Navigate to="/meeting" />
  }
  return children
}

export function TeacherMeetingGuard({ children }: { children: JSX.Element }) {
  const { hasAccessedMeeting } = useTeacherInfoStore()
  if (!hasAccessedMeeting) {
    return <Navigate to="/meeting" />
  }
  return children
}
