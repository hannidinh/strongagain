'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface EditListDialogProps {
    list: {
        id: string
        title: string
        is_public: boolean
    }
    onUpdate: (updatedList: any) => void
}

const supabase = createClient()

export default function EditListDialog({ list, onUpdate }: EditListDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(list.title || '')
    const [isPublic, setIsPublic] = useState(list.is_public)

    const handleSave = async () => {
        const { data, error } = await supabase
            .from('bad_ex_lists')
            .update({ title, is_public: isPublic })
            .eq('id', list.id)
            .select()
            .single()

        if (data) {
            onUpdate(data)
            setOpen(false)
        } else {
            alert('Error updating list')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit List</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit-list-public"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        <Label htmlFor="edit-list-public" className="text-sm">
                            Make list public
                        </Label>
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
