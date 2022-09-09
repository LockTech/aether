import { loadStripe } from '@stripe/stripe-js'

export const stripe = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)
