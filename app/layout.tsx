import type { Metadata } from 'next'; import './globals.css';
export const metadata:Metadata={title:{default:'MAAK Enterprises Company | Build • Develop • Grow',template:'%s | MAAK Enterprises'},description:'MAAK Enterprises Company — Real Estate, Construction and Educational Consultancy in Islamabad and Rawalpindi.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
