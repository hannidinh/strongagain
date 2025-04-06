'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

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
        <div className="min-h-screen flex bg-[#FAF7F5]">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r p-6 shadow-sm">
                <h2 className="text-2xl font-serif mb-8">Dashboard</h2>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li key={tab.key}>
                            <button
                                onClick={() => setActiveTab(tab.key)}
                                className={`text-left w-full px-3 py-2 rounded-md font-medium ${activeTab === tab.key
                                        ? 'bg-[#4A4A4A] text-white'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'hub' && (
                    <div>
                        <h1 className="text-3xl font-serif mb-4">Welcome, {user.email} 👋</h1>
                        <p className="text-gray-700">This is your healing hub. Track your progress and stay kind to yourself.</p>
                    </div>
                )}

                {activeTab === 'ex' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-4">📝 Your Bad Ex Lists</h2>
                        <p className="text-sm text-gray-600">Here you’ll manage your lists of reminders for healing.</p>
                        {/* TODO: Add form and list rendering */}
                    </div>
                )}

                {activeTab === 'quotes' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-4">💬 Your Motivational Quotes</h2>
                        <p className="text-sm text-gray-600">Add or manage your personal quote list.</p>
                        {/* TODO: Render user-submitted quotes */}
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-4">📺 Your Motivational Videos</h2>
                        <p className="text-sm text-gray-600">Embed or manage your healing video playlist.</p>
                        {/* TODO: Render user-submitted videos */}
                    </div>
                )}

                {activeTab === 'feed' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-4">🧠 Explore Feed</h2>
                        <p className="text-sm text-gray-600">View public posts shared by others on their healing journey.</p>
                        {/* TODO: Render public quotes, videos, lists */}
                    </div>
                )}

                {activeTab === 'library' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-4">📚 Common Quote & Video Library</h2>
                        <p className="text-sm text-gray-600">Curated and approved motivational content.</p>
                        {/* TODO: Render admin-approved quotes/videos */}
                    </div>
                )}
            </main>
        </div>
    )
}
