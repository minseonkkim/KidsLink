import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAppStore from '../../stores/store'

const SocialJoinRedirect = () => {
  const navigate = useNavigate() // 빈칸이면 현재 페이지 유지
  const location = useLocation() // 현재 url경로 가져오기
  const { setIsSocialLogin } = useAppStore()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const registrationId = queryParams.get('registrationId')
    const username = queryParams.get('username')
    const email = queryParams.get('email')

    if (registrationId && username && email) {
      setIsSocialLogin(true);
      navigate('/join', { state: { username, email } }) // username, email만 저장하려고 들고감
    } else {
      console.error('Missing query parameters')
    }
  }, [location, navigate, setIsSocialLogin])

  return <div>Redirecting...</div>
}

export default SocialJoinRedirect
