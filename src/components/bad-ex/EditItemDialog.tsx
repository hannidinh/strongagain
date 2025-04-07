'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface EditItemDialogProps {
    item: { id: string; content: string }
    listId: string
    onUpdate: (updatedContent: string) => void
}

export default function EditItemDialog({ item, listId, onUpdate }: EditItemDialogProps) {
    const [open, setOpen] = useState(false)
    const [newContent, setNewContent] = useState(item.content)

    const handleSave = async () => {
        const { error } = await supabase
            .from('bad_ex_list_items')
            .update({ content: newContent.trim() })
            .eq('id', item.id)

        if (!error) {
            onUpdate(newContent.trim())
            setOpen(false)
        } else {
            alert('Error saving item')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <Label htmlFor="item-edit">Item Text</Label>
                    <Input
                        id="item-edit"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
