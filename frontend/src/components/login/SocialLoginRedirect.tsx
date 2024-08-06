import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SocialLoginRedirect() {
  const navigate = useNavigate() // 빈칸이면 현재 페이지 유지
  const location = useLocation() // 현재 url경로 가져오기

  useEffect(() => {
    console.log(location)
    const queryParams = new URLSearchParams(location.search)
    const accessToken = queryParams.get('accessToken')
    const expiredAt = queryParams.get('expiredAt')
    const role = queryParams.get('role')

    if (accessToken && expiredAt) {
      navigate('/', { state: { accessToken, expiredAt, role } }) 
    } else {
      console.error('Missing query parameters')
    }
  }, [location, navigate])

  return <div>Redirecting...</div>
}

