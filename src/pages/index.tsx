import { GetStaticProps } from 'next';

import { useState } from 'react';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import styles from './home.module.scss';
// import commonStyles from '../styles/common.module.scss';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  slug: string | string[];
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
  results_size: number;
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function handleShowMorePosts(): Promise<string> {
    const paginationResponse = await fetch(postsPagination.next_page).then(
      response => {
        return response.json().then(postResult => {
          const formattedNewPosts = postResult.results.map(post => {
            return {
              ...post,
              first_publication_date: format(
                new Date(post.first_publication_date),
                'dd MMM yyyy',
                {
                  locale: ptBR,
                }
              ),
            };
          });
          return [...posts, ...formattedNewPosts];
        });
      }
    );

    setPosts(paginationResponse);
    return 'void';
  }

  console.log(postsPagination.results_size);

  return (
    <div className={styles.container}>
      <main className={styles.postsList}>
        {posts.map(post => (
          <Link href={`/post/${post.slug}`} key={post.uid}>
            <div className={styles.postContainer}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <FiCalendar />
                <p>{post.first_publication_date}</p>
                <FiUser />
                <p>{post.data.author}</p>
              </div>
            </div>
          </Link>
        ))}
        {posts.length >= postsPagination.results_size ||
        postsPagination.next_page === null ? (
          <></>
        ) : (
          <button type="button" onClick={() => handleShowMorePosts()}>
            Carregar mais posts
          </button>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 5,
    }
  );

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      slug: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
    results_size: postsResponse.total_results_size,
  };

  return {
    props: { postsPagination },
  };
};
