import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

interface PromisePost {
  props: { post: Post };
}

export default function Post({ post }: PostProps): JSX.Element {
  console.log(post);
  return (
    <main className={styles.pageContainer}>
      {post ? (
        <div className={styles.postContainer}>
          <h1>{post.data.content[0].heading}</h1>
          <div className={styles.postDetails}>
            <FiCalendar />
            <p>asasasasasas</p>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: post.data.content[0].body[0].text,
            }}
          />
        </div>
      ) : (
        <h1>...Carregando</h1>
      )}
    </main>
  );
}

export const getStaticPaths = async (): Promise<any> => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 3,
    }
  );

  return {
    paths: [
      {
        params: { slug: 'slug' },
      },
    ],
    fallback: true,
  };
};

export async function getStaticProps(context): Promise<PromisePost> {
  const prismic = getPrismicClient();
  const response = await prismic
    .getByUID('posts', context.params.slug, {})
    .then(res => {
      return res;
    });

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,
      content: [
        {
          heading: response.data.content[0].heading,
          body: [
            {
              text: RichText.asHtml(response.data.content[0].body),
            },
          ],
        },
      ],
    },
  };

  return { props: { post } };
}
