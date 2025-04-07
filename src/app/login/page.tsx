'use client'

import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'

const supabase = createClient()

export default function LoginPage() {
    const router = useRouter()

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    router.push('/dashboard')
                }
            }
        )

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [router])

    return (
        <div className="min-h-screen bg-[#F6E8D5] font-serif flex items-center justify-center px-4">
            <Card className="w-full max-w-md p-8 border border-[#e8d7c8] shadow-md bg-white rounded-[1.5rem] text-center">
                <h1 className="text-3xl font-bold mb-2 text-[#3b3b3b]">Welcome Back</h1>
                <p className="mb-6 text-sm text-[#6f655c] italic">
                    Healing begins with showing up for yourself.
                </p>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="light"
                    providers={[]}
                    redirectTo="/dashboard"
                />
            </Card>
        </div>
    )
}
