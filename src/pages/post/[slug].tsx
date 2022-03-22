import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDate } from '../../utils';

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
  return (
    <main className={styles.pageContainer}>
      {post ? (
        <div className={styles.postContainer}>
          <br />
          <h1>{post.data.title}</h1>
          <br />
          <div className={styles.postDetails}>
            <FiCalendar size={20} />
            <p>{post.first_publication_date}</p>
            <FiUser size={20} />
            <p>{post.data.author}</p>
            <FiClock size={20} />
            <p>5 min</p>
          </div>
          <div className={styles.postContent}>
            {post.data.content.map(content => {
              return (
                <div key={post.first_publication_date + content.heading}>
                  <h1>{content.heading}</h1>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  />
                </div>
              );
            })}
          </div>
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
    first_publication_date: formatDate(response.first_publication_date),
    data: {
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,
      content: response.data.content,
    },
  };

  return { props: { post } };
}
