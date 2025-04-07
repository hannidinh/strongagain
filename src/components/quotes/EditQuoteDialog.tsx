'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient();

export default function EditQuoteDialog({ quote, onUpdate }: { quote: any; onUpdate: (q: any) => void }) {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState(quote.quote)
    const [author, setAuthor] = useState(quote.author || '')

    const handleSave = async () => {
        const { data } = await supabase
            .from('quotes')
            .update({ quote: text, author })
            .eq('id', quote.id)
            .select()
            .single()

        if (data) {
            onUpdate(data)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Quote</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <Label htmlFor="quote-edit">Quote</Label>
                    <Input id="quote-edit" value={text} onChange={(e) => setText(e.target.value)} />
                    <Label htmlFor="author-edit">Author</Label>
                    <Input id="author-edit" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
