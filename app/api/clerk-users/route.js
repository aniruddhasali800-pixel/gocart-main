import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const client = await clerkClient()
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        // Single user lookup
        if (userId) {
            try {
                const user = await client.users.getUser(userId)
                return NextResponse.json({
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.emailAddresses?.[0]?.emailAddress || null,
                        imageUrl: user.imageUrl,
                        createdAt: user.createdAt,
                    },
                })
            } catch {
                return NextResponse.json({ user: null })
            }
        }

        // List all users
        const users = await client.users.getUserList({ limit: 100 })

        const serialized = (users?.data || []).map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses?.[0]?.emailAddress || null,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
        }))

        return NextResponse.json({ users: serialized })
    } catch (error) {
        return NextResponse.json({ users: [], error: error.message }, { status: 500 })
    }
}
