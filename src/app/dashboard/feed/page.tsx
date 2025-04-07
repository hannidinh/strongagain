'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const supabase = createClient()

export default function ExploreFeedPage() {
    const [quotes, setQuotes] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [badExLists, setBadExLists] = useState<any[]>([])

    useEffect(() => {
        const fetchFeed = async () => {
            const [quoteData, videoData, listData] = await Promise.all([
                supabase.from('quotes').select('*').eq('is_public', true).order('created_at', { ascending: false }),
                supabase.from('videos').select('*').eq('is_public', true).order('created_at', { ascending: false }),
                supabase
                    .from('bad_ex_lists')
                    .select(`
            id,
            title,
            user_id,
            bad_ex_list_items!inner(id, content, is_public)
          `)
                    .eq('is_public', true)
                    .eq('bad_ex_list_items.is_public', true)
                    .order('created_at', { ascending: false }),
            ])

            setQuotes(quoteData.data || [])
            setVideos(videoData.data || [])
            setBadExLists(listData.data || [])
        }

        fetchFeed()
    }, [])

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
            <h1 className="text-3xl font-serif font-bold">🧠 Explore Feed</h1>
            <p className="text-sm text-muted-foreground">
                Public healing posts shared by the community — quotes, videos, and reasons to let go.
            </p>

            {/* Bad Ex Lists Section */}
            <section>
                <h2 className="text-2xl font-serif mb-4">📝 Shared “Bad Ex” Lists</h2>
                <div className="space-y-4">
                    {badExLists.map((list) => (
                        <Card key={list.id} className="p-4 space-y-2">
                            <h4 className="font-semibold">{list.title || 'Untitled List'}</h4>
                            <ul className="list-disc ml-4 text-sm space-y-1">
                                {list.bad_ex_list_items?.map((item: any) => (
                                    <li key={item.id}>{item.content}</li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </section>
            <Separator className="my-6" />

            {/* Quotes Section */}
            <section>
                <h2 className="text-2xl font-serif mb-4">💬 Public Quotes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quotes.map((q) => (
                        <Card key={q.id} className="p-4">
                            <blockquote className="italic mb-2">“{q.quote}”</blockquote>
                            {q.author && <p className="text-sm text-right">— {q.author}</p>}
                        </Card>
                    ))}
                </div>
            </section>

            <Separator className="my-6" />

            {/* Videos Section */}
            <section>
                <h2 className="text-2xl font-serif mb-4">📺 Public Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map((v) => (
                        <Card key={v.id} className="p-4">
                            <h3 className="font-semibold mb-1">{v.title}</h3>
                            {v.description && <p className="text-sm text-muted-foreground mb-2">{v.description}</p>}
                            <div className="aspect-video">
                                <iframe
                                    src={v.video_url}
                                    className="rounded w-full h-full"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}
