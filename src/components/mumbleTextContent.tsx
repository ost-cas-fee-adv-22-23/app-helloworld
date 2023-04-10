import React, { FC } from 'react';
import Link from 'next/link';

interface MumbleTextContent {
  text: string;
}

export const MumbleTextContent: FC<MumbleTextContent> = ({ text }) => {
  const processedText = text.split(" ");

  return (
    // <>
    <div className={'paragraph-M'}>
      {processedText.map((text, index) =>
        text.match(/#(\w+)(?!\w)/g) ? (
          <Link href={`tag/${text.substring(1)}`} className={'paragraph-M text-violet-600'} key={index}>
            {`${text} `}
          </Link>
        ) : (
          <span key={index}>{`${text} `}</span>
        )
      )}
    </div>
    // </>
  );
};
