"use client"
// src/app/dashboard/layout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const tabs = [
    { href: '/dashboard/hub', label: 'My Healing Hub' },
    { href: '/dashboard/bad-ex', label: 'Bad Ex List' },
    { href: '/dashboard/quotes', label: 'My Quotes' },
    { href: '/dashboard/videos', label: 'My Videos' },
    { href: '/dashboard/feed', label: 'Explore Feed' },
    { href: '/dashboard/library', label: 'Common Library' }
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex bg-[#FAF7F5]">
            <aside className="w-64 bg-white border-r p-6 shadow-sm">
                <h2 className="text-2xl font-serif mb-8">Dashboard</h2>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li key={tab.href}>
                            <Link href={tab.href}>
                                <Button
                                    variant={pathname === tab.href ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                >
                                    {tab.label}
                                </Button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
    )
}
