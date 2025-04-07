'use client'

import { Card } from '@/components/ui/card'

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
            <h1 className="text-4xl font-serif font-bold">🌿 About StrongAgain</h1>

            <Card className="p-6 space-y-4">
                <p className="text-lg leading-relaxed">
                    <strong>StrongAgain</strong> is more than an app — it’s a quiet corner of the internet created from heartbreak,
                    for healing. I built it while going through one of the most painful emotional experiences of my life.
                </p>

                <p className="text-lg leading-relaxed">
                    I was in the middle of my own heartbreak — a time full of confusion, replaying memories, and longing for clarity.
                    During that time, I traveled to California, carrying the weight of my own emotional storm. While at the airport,
                    I noticed two women crying. One of them even sat next to me on the flight. We didn’t speak — but I felt an invisible
                    thread connecting us. In their grief, I saw myself. I wished I had a way to offer them hope.
                </p>

                <p className="text-lg leading-relaxed">
                    That’s when I knew: if I’m hurting and they’re hurting, then maybe others are too — silently, without support.
                    I wanted to build something that could gently guide us all through the pain and back into strength.
                </p>

                <p className="text-lg leading-relaxed italic border-l-4 border-muted pl-4 text-muted-foreground">
                    A major spark of inspiration came from the TED talk{' '}
                    <a
                        href="https://www.youtube.com/watch?v=k0GQSJrpVhM&t=624s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        “How to Fix a Broken Heart” by Guy Winch
                    </a>.
                    His words helped me realize how important it is to actively heal, not just wait for time to pass.
                </p>

                <p className="text-lg leading-relaxed">
                    <strong>StrongAgain</strong> exists to help you heal:
                    to break the cycle of idealizing those who hurt us,
                    to rediscover our voice through quotes and affirmations,
                    and to find strength in seeing that you are not alone.
                </p>

                <p className="text-lg leading-relaxed">
                    Whether you’re crying in an airport or quietly holding it together at home — this space is for you.
                </p>

                <p className="text-right text-muted-foreground text-sm mt-6">
                    With empathy and strength,
                    <br />
                    <strong>Hien Dinh</strong>
                </p>
            </Card>
        </div>
    )
}
