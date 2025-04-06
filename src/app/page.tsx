'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export default function HomePage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [lists, setLists] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const { data: sessionData } = await supabase.auth.getUser()
      setUser(sessionData.user)

      const { data: quotesData } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_public', true)
        .eq('is_approved', true)
        .limit(6)
      setQuotes(quotesData || [])

      const { data: videosData } = await supabase
        .from('videos')
        .select('*')
        .eq('is_public', true)
        .eq('is_approved', true)
        .limit(3)
      setVideos(videosData || [])

      const { data: exListsData } = await supabase
        .from('bad_ex_lists')
        .select('id, title, user_id, bad_ex_list_items(content)')
        .eq('is_public', true)
        .limit(3)
      setLists(exListsData || [])
    }

    fetchContent()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#4A4A4A]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-sm">
        <div className="text-2xl font-serif font-semibold">StrongAgain</div>
        <div className="flex gap-4 items-center">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm underline">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm underline">Login</Link>
              <Link href="/signup" className="text-sm underline">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-serif mb-4">Let Go. Heal. Grow.</h1>
        <p className="text-lg mb-8">A gentle space to rediscover your strength.</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/signup" className="px-6 py-3 bg-black text-white rounded-full text-sm">Join Now</Link>
          <Link href="/quotes" className="px-6 py-3 border rounded-full text-sm">Explore Quotes</Link>
          <Link href="/videos" className="px-6 py-3 border rounded-full text-sm">Watch Motivational Videos</Link>
        </div>
      </section>

      {/* Quotes */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">🌟 Popular Quotes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <div key={q.id} className="bg-white p-4 rounded-lg shadow">
              <blockquote className="italic mb-2">“{q.quote}”</blockquote>
              {q.author && <p className="text-sm text-right">— {q.author}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">🎥 Popular Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="aspect-video w-full">
              <iframe
                src={v.video_url}
                title={v.title}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded shadow"
              ></iframe>
            </div>
          ))}
        </div>
      </section>

      {/* Bad Ex Lists */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif mb-4">🔥 Recently Publicized “Bad Ex” Lists</h2>
        <div className="grid gap-6">
          {lists.map((list) => (
            <div key={list.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">{list.title || 'Anonymous List'}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {list.bad_ex_list_items?.map((item: any, i: number) => (
                  <li key={i}>{item.content}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
