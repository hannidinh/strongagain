'use client'
import { formatYouTubeUrl } from '@/lib/utils'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export default function EditVideoDialog({
    video,
    onUpdate,
}: {
    video: any
    onUpdate: (v: any) => void
}) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(video.title || '')
    const [url, setUrl] = useState(video.video_url || '')
    const [description, setDescription] = useState(video.description || '')

    const handleSave = async () => {
        const cleanedUrl = url.includes('/embed') ? url : formatYouTubeUrl(url.trim())
        if (!cleanedUrl) {
            alert('Invalid YouTube URL')
            return
        }

        const { data } = await supabase
            .from('videos')
            .update({
                title,
                video_url: cleanedUrl,
                description,
            })
            .eq('id', video.id)
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
                <Button size="sm" variant="outline">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md space-y-4">
                <DialogHeader>
                    <DialogTitle>Edit Video</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label>YouTube Embed URL</Label>
                    <Input value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="pt-2 flex justify-end">
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
