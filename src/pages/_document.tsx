import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="de">
      <title>Mumble - The world`&apos;`s best social network!</title>
      <meta
        name="description"
        content="This is the world's best social media network and we would add many more descriptive keys words here to improve SEO. ;-)"
      ></meta>
      <Head />
      <body className="width-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
