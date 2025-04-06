'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Welcome to your dashboard</h1>
            {user && <p className="mt-4">Logged in as: {user.email}</p>}
        </div>
    )
}
