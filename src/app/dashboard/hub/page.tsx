'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const supabase = createClient()

const affirmations = [
    "Healing is not linear. You’re doing better than you think.",
    "You don’t have to have it all figured out today.",
    "It’s okay to miss them and still move on.",
    "Growth often feels like grief. That’s okay.",
    "You are not alone, and this pain won’t last forever.",
]

const moods = [
    { label: '😢 Sad', value: 'sad' },
    { label: '😐 Neutral', value: 'neutral' },
    { label: '😊 Okay', value: 'okay' },
    { label: '😄 Good', value: 'good' },
    { label: '🌟 Empowered', value: 'empowered' },
]

export default function HealingHub() {
    const [user, setUser] = useState<any>(null)
    const [moodHistory, setMoodHistory] = useState<any[]>([])
    const [selectedMood, setSelectedMood] = useState<string | null>(null)

    const todayAffirmation = affirmations[new Date().getDate() % affirmations.length]

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUser(data.user)
        })
    }, [])

    useEffect(() => {
        if (!user) return
        const fetchMoods = async () => {
            const { data } = await supabase
                .from('mood_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(7)
            setMoodHistory(data || [])
        }
        fetchMoods()
    }, [user, selectedMood])

    const handleMoodSelect = async (mood: string) => {
        if (!user) return
        setSelectedMood(mood)
        await supabase.from('mood_logs').insert({
            user_id: user.id,
            mood,
        })
    }

    return (
        <div className="max-w-3xl mx-auto p-10 space-y-10">
            <h1 className="text-3xl font-serif font-bold">
                Welcome, {user?.email} 👋
            </h1>
            <p className="text-muted-foreground mb-6">
                This is your healing hub. Track your progress and stay kind to yourself.
            </p>

            {/* 🌞 Daily Affirmation */}
            <Card className="p-6 text-center bg-blue-50 border-blue-200">
                <p className="text-lg italic text-muted-foreground">“{todayAffirmation}”</p>
            </Card>

            {/* 🌈 Mood Tracker */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">🌤 How are you feeling today?</h2>
                <div className="flex gap-2 flex-wrap">
                    {moods.map((m) => (
                        <Button
                            key={m.value}
                            variant={selectedMood === m.value ? 'default' : 'outline'}
                            onClick={() => handleMoodSelect(m.value)}
                        >
                            {m.label}
                        </Button>
                    ))}
                </div>

                {moodHistory.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-medium text-muted-foreground text-sm mb-1">Last 7 entries</h3>
                        <div className="flex gap-3 items-center">
                            {moodHistory.map((m) => (
                                <div key={m.id} className="text-xl text-center">
                                    {moodEmoji(m.mood)}
                                    <div className="text-xs text-muted-foreground">
                                        {format(new Date(m.created_at), 'MMM d')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

// Emoji helper for mood rendering
function moodEmoji(mood: string) {
    return {
        sad: '😢',
        neutral: '😐',
        okay: '😊',
        good: '😄',
        empowered: '🌟',
    }[mood] || '❓'
}
