'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import EditVideoDialog from '@/components/videos/EditVideoDialog'
import { useRouter } from 'next/navigation'
import { formatYouTubeUrl } from '@/lib/utils'


const supabase = createClient()

export default function VideosPage() {
    const [user, setUser] = useState<any>(null)
    const [title, setTitle] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [description, setDescription] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [videos, setVideos] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            if (data?.user) {
                setUser(data.user)
                const { data: vids } = await supabase
                    .from('videos')
                    .select('*')
                    .eq('user_id', data.user.id)
                    .order('created_at', { ascending: false })
                setVideos(vids || [])
            } else {
                router.replace('/login')
            }
        })
    }, [router])

    const handleAdd = async () => {
        const embedUrl = formatYouTubeUrl(videoUrl.trim())
        if (!embedUrl || !title.trim()) return alert('Invalid YouTube URL')

        const { data, error } = await supabase
            .from('videos')
            .insert([
                {
                    title,
                    video_url: embedUrl,
                    description: description.trim(),
                    is_public: isPublic,
                    user_id: user.id,
                },
            ])
            .select()
            .single()

        if (data) {
            setVideos([data, ...videos])
            setTitle('')
            setVideoUrl('')
            setDescription('')
            setIsPublic(false)
        }
    }


    const handleDelete = async (id: string) => {
        await supabase.from('videos').delete().eq('id', id)
        setVideos(videos.filter((v) => v.id !== id))
    }

    const toggleVisibility = async (video: any) => {
        const { data } = await supabase
            .from('videos')
            .update({ is_public: !video.is_public })
            .eq('id', video.id)
            .select()
            .single()

        if (data) {
            setVideos((prev) =>
                prev.map((v) => (v.id === data.id ? data : v))
            )
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-3xl font-serif font-bold mb-2">📺 Your Motivational Videos</h1>

            {/* Form */}
            <div className="space-y-2">
                <Input
                    placeholder="Video Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    placeholder="YouTube Embed URL (e.g. https://www.youtube.com/embed/...)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
                <Input
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="video-public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <Label htmlFor="video-public" className="text-sm">
                        Make Video Public
                    </Label>
                </div>
                <Button onClick={handleAdd}>➕ Add Video</Button>
            </div>

            {/* Video List */}
            <div className="space-y-4 pt-8">
                {videos.map((video) => (
                    <Card key={video.id} className="p-4 space-y-2">
                        <h2 className="text-lg font-semibold">{video.title}</h2>
                        {video.description && <p className="text-sm italic">{video.description}</p>}
                        <div className="aspect-video">
                            <iframe
                                src={video.video_url}
                                className="rounded w-full h-full"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                size="sm"
                                variant={video.is_public ? 'default' : 'outline'}
                                onClick={() => toggleVisibility(video)}
                            >
                                {video.is_public ? '🌍 Public' : '🔒 Private'}
                            </Button>
                            <EditVideoDialog
                                video={video}
                                onUpdate={(updated) =>
                                    setVideos((prev) =>
                                        prev.map((v) => (v.id === updated.id ? updated : v))
                                    )
                                }
                            />
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(video.id)}>
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
