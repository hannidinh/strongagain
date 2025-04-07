'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const supabase = createClient()

export default function HubTab() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUser(data.user)
            else router.replace('/login')
        })
    }, [router])

    if (!user) return <p className="p-8">Loading...</p>

    return (
        <div>
            <h1 className="text-3xl font-serif mb-4">
                Welcome, {user.email} <span>👋</span>
            </h1>
            <p className="text-gray-700">
                This is your healing hub. Track your progress and stay kind to yourself.
            </p>
        </div>
    )
}
