'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import EditQuoteDialog from '@/components/quotes/EditQuoteDialog'

const supabase = createClient()

export default function QuotesPage() {
    const [user, setUser] = useState<any>(null)
    const [quote, setQuote] = useState('')
    const [author, setAuthor] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [quotes, setQuotes] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (data?.user) {
                setUser(data.user)
                const { data: q } = await supabase
                    .from('quotes')
                    .select('*')
                    .eq('user_id', data.user.id)
                    .order('id', { ascending: false })
                setQuotes(q || [])
            } else {
                router.replace('/login')
            }
        })
    }, [router])

    const handleAdd = async () => {
        if (!quote.trim()) return
        const { data, error } = await supabase
            .from('quotes')
            .insert([{ quote, author, is_public: isPublic, user_id: user.id }])
            .select()
            .single()

        if (data) {
            setQuotes([data, ...quotes])
            setQuote('')
            setAuthor('')
            setIsPublic(false)
        }
    }

    const handleDelete = async (id: string) => {
        await supabase.from('quotes').delete().eq('id', id)
        setQuotes(quotes.filter((q) => q.id !== id))
    }

    const toggleVisibility = async (q: any) => {
        const { data } = await supabase
            .from('quotes')
            .update({ is_public: !q.is_public })
            .eq('id', q.id)
            .select()
            .single()

        if (data) {
            setQuotes((prev) =>
                prev.map((i) => (i.id === data.id ? { ...i, is_public: data.is_public } : i))
            )
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-3xl font-serif font-bold mb-2">💬 Your Motivational Quotes</h1>

            {/* Form */}
            <div className="space-y-2">
                <Input
                    placeholder="Enter a quote"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                />
                <Input
                    placeholder="Author (optional)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="quote-public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <Label htmlFor="quote-public" className="text-sm">
                        Make Quote Public
                    </Label>
                </div>
                <Button onClick={handleAdd}>➕ Add Quote</Button>
            </div>

            {/* Saved Quotes */}
            <div className="space-y-4 pt-8">
                {quotes.map((q) => (
                    <Card key={q.id} className="p-4 space-y-2">
                        <blockquote className="italic text-lg">“{q.quote}”</blockquote>
                        {q.author && <p className="text-sm text-right">— {q.author}</p>}
                        <div className="flex gap-2 justify-end pt-2">
                            <Button
                                size="sm"
                                variant={q.is_public ? 'default' : 'outline'}
                                onClick={() => toggleVisibility(q)}
                            >
                                {q.is_public ? '🌍 Public' : '🔒 Private'}
                            </Button>
                            <EditQuoteDialog
                                quote={q}
                                onUpdate={(updated) =>
                                    setQuotes((prev) =>
                                        prev.map((item) => (item.id === updated.id ? updated : item))
                                    )
                                }
                            />
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(q.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
