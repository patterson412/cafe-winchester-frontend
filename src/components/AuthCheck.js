'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../../lib/hooks'
import { setUser, setLoading, clearUser } from '../../lib/features/user/userSlice'
import axios from 'axios'

export default function AuthCheck({ children }) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)
    const loading = useAppSelector((state) => state.user.loading)

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                dispatch(setLoading(true))
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
                        withCredentials: true
                    })

                    dispatch(setUser(response.data))
                } catch (error) {
                    dispatch(clearUser())
                    router.push('/login')
                }
            }
        }

        checkAuth()
    }, [user, dispatch, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return null
    }

    return children
}