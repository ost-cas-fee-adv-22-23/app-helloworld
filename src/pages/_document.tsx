import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="de">
      <title>Mumble - The best social network!</title>
      <meta
        name="description"
        content="This is the world's best social media network and we would add many more descriptive keys words here to improve SEO. ;-)"
      ></meta>
      <meta name="application-name" content="Hello World Mumble App" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="HW Mumble App" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <link rel="manifest" href="/manifest.json" />

      <Head />
      <body className="max-w-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
