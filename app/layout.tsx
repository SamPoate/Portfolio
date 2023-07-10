export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <title>Sam Poate</title>
                <meta
                    name='description'
                    content='Sam Poate is a self-taught front end engineer with a passion to keep learning and strong team player and believer in people.'
                />
                <link rel='icon' href='/favicon.ico' />
            </head>
            <body>{children}</body>
        </html>
    );
}
