'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import EditListDialog from '@/components/bad-ex/EditListDialog'
import { PencilIcon, TrashIcon } from 'lucide-react'
import EditItemDialog from '@/components/bad-ex/EditItemDialog'


const supabase = createClient()

export default function BadExListPage() {
    const [user, setUser] = useState<any>(null)
    const [title, setTitle] = useState('')
    const [item, setItem] = useState('')
    const [items, setItems] = useState<{ content: string; is_public: boolean }[]>([])
    const [isPublicList, setIsPublicList] = useState(false)
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUser(data.user)
            else router.replace('/login')
        })
    }, [router])

    const handleAddItem = () => {
        if (!item.trim()) return
        setItems([...items, { content: item.trim(), is_public: false }])
        setItem('')
    }

    const toggleItemVisibility = (index: number) => {
        const updated = [...items]
        updated[index].is_public = !updated[index].is_public
        setItems(updated)
    }

    const handleSave = async () => {
        if (!user) return

        const { data: list, error } = await supabase
            .from('bad_ex_lists')
            .insert([{ title, is_public: isPublicList, user_id: user.id }])
            .select()
            .single()

        if (list) {
            const listItems = items.map((i) => ({ list_id: list.id, ...i }))
            await supabase.from('bad_ex_list_items').insert(listItems)

            alert('Saved!')
            setTitle('')
            setItems([])
        } else {
            console.error('Error saving list:', error)
        }
    }

    const speakItems = (repeat = false) => {
        if (!items.length) return
        const combinedText = items.map((i) => i.content).join('. ')
        const utterance = new SpeechSynthesisUtterance(combinedText)
        utterance.rate = 0.9
        if (repeat) utterance.onend = () => window.speechSynthesis.speak(utterance)
        speechRef.current = utterance
        window.speechSynthesis.speak(utterance)
    }

    // 🔽 New state for fetched lists
    const [savedLists, setSavedLists] = useState<any[]>([])

    useEffect(() => {
        const fetchSavedLists = async () => {
            if (!user) return
            const { data } = await supabase
                .from('bad_ex_lists')
                .select('id, title, is_public, bad_ex_list_items(id, content, is_public)')
                .eq('user_id', user.id)
                .order('id', { ascending: false })
            if (data) setSavedLists(data)
        }

        fetchSavedLists()
    }, [user])

    // 🔽 Delete list handler
    const handleDeleteList = async (listId: string) => {
        await supabase.from('bad_ex_lists').delete().eq('id', listId)
        setSavedLists(savedLists.filter((l) => l.id !== listId))
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-3xl font-bold font-serif text-[#3b3b3b] mb-4">
                📝 Create “Bad Things About Ex” List
            </h1>

            <div>
                <Label htmlFor="title" className="text-sm text-gray-600 mb-1 block">
                    List Title (optional)
                </Label>
                <Input
                    id="title"
                    placeholder="e.g. Why I let go..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Add an item..."
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                />
                <Button onClick={handleAddItem}>➕ Add</Button>
            </div>

            <div className="space-y-2">
                {items.map((i, idx) => (
                    <Card key={idx} className="flex justify-between items-center p-4">
                        <span className="text-sm text-gray-800">{i.content}</span>
                        <Button
                            size="sm"
                            variant={i.is_public ? 'default' : 'outline'}
                            onClick={() => toggleItemVisibility(idx)}
                        >
                            {i.is_public ? 'Public' : 'Private'}
                        </Button>
                    </Card>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="list-visibility"
                    checked={isPublicList}
                    onChange={(e) => {
                        const newValue = e.target.checked
                        setIsPublicList(newValue)
                        setItems((prev) =>
                            prev.map((item) => ({ ...item, is_public: newValue }))
                        )
                    }}
                />
                <Label htmlFor="list-visibility" className="text-sm">
                    Make Entire List Public
                </Label>
            </div>


            <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => speakItems(false)}>🔊 Play</Button>
                <Button variant="outline" onClick={() => speakItems(true)}>🔁 Repeat</Button>
                <Button onClick={handleSave}>💾 Save List</Button>
            </div>

            <hr className="my-6" />
            <h2 className="text-2xl font-serif mb-4">🕘 Saved Lists</h2>

            <div className="space-y-4">
                {savedLists.map((list) => (
                    <Card key={list.id} className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="font-semibold text-lg">{list.title || '(Untitled)'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {list.is_public ? '🌍 Public' : '🔒 Private'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* 📝 Edit action (can be implemented later) */}
                                <EditListDialog
                                    list={list}
                                    onUpdate={(updated) => {
                                        setSavedLists((prev) =>
                                            prev.map((l) => (l.id === updated.id ? updated : l))
                                        )
                                    }}
                                />

                                {/* 🗑 Delete action */}
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteList(list.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                            {list.bad_ex_list_items?.map((item: any, i: number) => (
                                <li
                                    key={item.id}
                                    className="flex justify-between items-center border rounded px-3 py-2 transition hover:shadow-sm"
                                >
                                    <span>{item.content}</span>
                                    <div className="flex items-center gap-2">
                                        {/* 🔁 Toggle visibility */}
                                        <Button
                                            size="sm"
                                            variant={item.is_public ? 'default' : 'outline'}
                                            onClick={async () => {
                                                await supabase
                                                    .from('bad_ex_list_items')
                                                    .update({ is_public: !item.is_public })
                                                    .eq('id', item.id)

                                                // Update local state
                                                setSavedLists((prev) =>
                                                    prev.map((l) =>
                                                        l.id === list.id
                                                            ? {
                                                                ...l,
                                                                bad_ex_list_items: l.bad_ex_list_items.map((it: any) =>
                                                                    it.id === item.id ? { ...it, is_public: !item.is_public } : it
                                                                ),
                                                            }
                                                            : l
                                                    )
                                                )
                                            }}
                                        >
                                            {item.is_public ? '🌍' : '🔒'}
                                        </Button>

                                        {/* ✏️ Edit button */}
                                        <EditItemDialog
                                            item={item}
                                            listId={list.id}
                                            onUpdate={(newContent) => {
                                                setSavedLists((prev) =>
                                                    prev.map((l) =>
                                                        l.id === list.id
                                                            ? {
                                                                ...l,
                                                                bad_ex_list_items: l.bad_ex_list_items.map((it: any) =>
                                                                    it.id === item.id ? { ...it, content: newContent } : it
                                                                ),
                                                            }
                                                            : l
                                                    )
                                                )
                                            }}
                                        />


                                        {/* 🗑 Delete button */}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={async () => {
                                                await supabase.from('bad_ex_list_items').delete().eq('id', item.id)
                                                setSavedLists((prev) =>
                                                    prev.map((l) =>
                                                        l.id === list.id
                                                            ? {
                                                                ...l,
                                                                bad_ex_list_items: l.bad_ex_list_items.filter(
                                                                    (it: any) => it.id !== item.id
                                                                ),
                                                            }
                                                            : l
                                                    )
                                                )
                                            }}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </Card>
                ))}
            </div>

        </div>
    )
}
