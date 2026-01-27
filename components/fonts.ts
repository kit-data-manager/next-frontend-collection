import { Lusitana, Source_Sans_3 } from 'next/font/google'

export const sourceSans3 = Source_Sans_3({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-source-sans',
})

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-lusitana',
})