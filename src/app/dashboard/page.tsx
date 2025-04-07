'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

const supabase = createClient()

const tabs = [
    { key: 'hub', label: 'My Healing Hub' },
    { key: 'ex', label: 'Bad Ex List' },
    { key: 'quotes', label: 'My Quotes' },
    { key: 'videos', label: 'My Videos' },
    { key: 'feed', label: 'Explore Feed' },
    { key: 'library', label: 'Common Library' },
]

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('hub')
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data, error }) => {
            if (data?.user) {
                setUser(data.user)
            } else {
                router.replace('/login')
            }
        })
    }, [router])

    if (!user) return <p className="p-8">Loading...</p>

    return (
        <div className="min-h-screen flex bg-[#f8f3ef] font-serif">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r p-6 shadow-sm rounded-tr-3xl rounded-br-3xl">
                <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li key={tab.key}>
                            <Button
                                variant={activeTab === tab.key ? 'default' : 'outline'}
                                onClick={() => setActiveTab(tab.key)}
                                className="w-full justify-start rounded-full px-4 py-2"
                            >
                                {tab.label}
                            </Button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-10 overflow-y-auto">
                {activeTab === 'hub' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Welcome, {user.email} 👋</h1>
                        <p className="text-[#5a5149]">This is your healing hub. Track your progress and stay kind to yourself.</p>
                    </div>
                )}

                {activeTab === 'ex' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">📝 Your Bad Ex Lists</h2>
                        <p className="text-sm text-[#6d5e54]">Here you’ll manage your lists of reminders for healing.</p>
                    </div>
                )}

                {activeTab === 'quotes' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">💬 Your Motivational Quotes</h2>
                        <p className="text-sm text-[#6d5e54]">Add or manage your personal quote list.</p>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">📺 Your Motivational Videos</h2>
                        <p className="text-sm text-[#6d5e54]">Embed or manage your healing video playlist.</p>
                    </div>
                )}

                {activeTab === 'feed' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">🧠 Explore Feed</h2>
                        <p className="text-sm text-[#6d5e54]">View public posts shared by others on their healing journey.</p>
                    </div>
                )}

                {activeTab === 'library' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">📚 Common Quote & Video Library</h2>
                        <p className="text-sm text-[#6d5e54]">Curated and approved motivational content.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
