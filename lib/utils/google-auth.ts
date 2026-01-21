import { signInWithGoogle } from '@/lib/actions/auth'

export async function handleGoogleSignIn() {
    const result = await signInWithGoogle()

    if (result.error) {
        return { error: result.error }
    } else if (result.data?.url) {
        // Redirect to Google OAuth
        window.location.href = result.data.url
        return { success: true }
    }

    return { error: 'Unknown error occurred' }
}
