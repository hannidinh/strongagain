'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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
        .limit(6)
      setVideos(videosData || [])

      const { data: exListsData } = await supabase
        .from('bad_ex_lists')
        .select(`
        id,
        title,
        user_id,
        bad_ex_list_items:bad_ex_list_items(content)
      `)
        .eq('is_public', true)
        .filter('bad_ex_list_items.is_public', 'eq', true) // ✅ Only include public items
        .limit(3)

      setLists(exListsData || [])

    }

    fetchContent()
  }, [])

  return (
    <div className="min-h-screen bg-[#F6E8D5] text-[#3b3b3b] font-serif">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-[#fffefb] shadow-sm border-b border-[#f0e8df]">
        <div className="text-2xl font-bold tracking-wide">StrongAgain</div>
        <div className="flex gap-4 text-sm">
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          {user ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-4 bg-[#f4ede3] bg-gradient-to-b from-[#e0e6e3] to-[#f6e6dc]">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-[#2b2b2b]">Let Go. Heal. Grow.</h1>
        <p className="text-lg mb-10 text-[#6f655c] max-w-2xl mx-auto italic">
          A soft, healing space to rebuild your emotional strength and rediscover joy again.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button className="rounded-full px-6 py-3 text-lg bg-[#a07c68] hover:bg-[#8f6b57] text-white">Join Now</Button>
          <Button variant="outline" className="rounded-full px-6 py-3 text-lg border-[#a07c68] text-[#a07c68] hover:bg-[#f2eae2]">Explore Quotes</Button>
          <Button variant="outline" className="rounded-full px-6 py-3 text-lg border-[#a07c68] text-[#a07c68] hover:bg-[#f2eae2]">Watch Videos</Button>
        </div>
      </section>

      {/* Recently Publicized Lists */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#3f3f3f]">🔥 Recently Publicized “Bad Ex” Lists</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {lists.map((list) => (
            <Card key={list.id} className="p-6 bg-white rounded-[1.5rem] border border-[#ece4da] shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#2c2c2c]">{list.title || 'Anonymous List'}</h3>
              <ul className="list-disc pl-6 text-sm text-[#4a4a4a] space-y-1">
                {list.bad_ex_list_items?.map((item: any, i: number) => (
                  <li key={i}>{item.content}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Quotes */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#3f3f3f]">🌟 Popular Quotes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <Card key={q.id} className="p-6 bg-[#fffdfb] rounded-[1.5rem] border border-[#ede1d8] shadow-sm text-center">
              <blockquote className="italic mb-3 text-[#4a4a4a]">“{q.quote}”</blockquote>
              {q.author && <p className="text-sm text-[#9a897f]">— {q.author}</p>}
            </Card>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[#3f3f3f]">🎥 Popular Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v) => (
            <Card key={v.id} className="overflow-hidden aspect-video rounded-[1.5rem] border border-[#e4dcd2] shadow-sm">
              <iframe
                src={v.video_url}
                title={v.title}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </Card>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-[#a89a8b] py-12 mt-10 border-t border-[#e9dfd5] bg-[#fffaf5]">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/h.jpeg"
            alt="Hien Dinh"
            width={48}
            height={48}
            className="rounded-full shadow-md hover:scale-105 transition-transform"
          />
          <p>
            by <span className="font-medium">Hien Dinh</span> —{' '}
            <a
              href="https://www.linkedin.com/in/hannidinhcs/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#7b5e4b]"
            >
              Wanna know more about me
            </a>
          </p>
          <p className="text-xs opacity-60">© 2025 StrongAgain. Built with kindness 💛</p>
        </div>
      </footer>
    </div>
  )
}
