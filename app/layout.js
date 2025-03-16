import { WalletContextProvider } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Memecoin Project</title>
      </head>
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}

