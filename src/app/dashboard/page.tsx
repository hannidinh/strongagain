'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export default function DashboardIndexRedirect() {
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                router.replace('/dashboard/hub')
            } else {
                router.replace('/login')
            }
        })
    }, [router])

    return <p className="p-8 text-center">Redirecting to your healing hub...</p>
}
