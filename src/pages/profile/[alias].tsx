import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { UserProfile } from '@smartive-education/design-system-component-library-hello-world-team';
import Link from 'next/link';

type Props = {
  profile: {
    alias: string;
  };
};

export default function ProfilePage({ profile }: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <>
      <UserProfile
        altText="Robert Vogt"
        fullName="Robert Vogt"
        hrefProfile="#"
        imageSrc="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
        img="https://picsum.photos/800/600"
        joined="Mitglied seit 4 Wochen"
        labelType="XL"
        location="St. Gallen"
        profilePictureSize="XL"
        timestamp="vor 42 Minuten"
        username="robertvogt"
        link={Link}
        href={`/`}
      >
        Quia aut et aut. Sunt et eligendi similique enim qui quo minus. Aut aut error velit voluptatum optio sed quis cumque
        error magni.
      </UserProfile>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: { alias } }) => {
  return {
    props: {
      profile: { alias },
    },
  };
};
