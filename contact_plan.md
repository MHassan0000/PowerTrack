# Contact Page Implementation Plan

## 1. Validation Schema

Create `lib/validations/contact.ts`:

- Name: string (min 2, max 50)
- Email: email validation
- Message: string (min 10, max 1000)

## 2. Contact Page (`app/(root)/contact/page.tsx`)

- Client component
- Form with fields: Name, Email, Message
- EmailJS integration
- Loading state handling
- Success/Error toasts (using Sonner)

## 3. EmailJS Config (Client-side)

- User needs to add envs:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

## 4. Design

- Match minimal dark theme
- Framer motion for entry animation
