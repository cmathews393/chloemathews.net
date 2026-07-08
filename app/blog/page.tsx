"use client";
import Navbar from '@/components/Navbar';
import React, { useEffect } from 'react';


import styles from "@/app/page.module.css";
import { allowedNodeEnvironmentFlags } from 'process';
import { Metadata } from 'next';
const metadata: Metadata = {
  title: 'Blog',
};
const RSSFEEDS:Feed[] = [
  { label: "Listed.to", href: "https://listed.to/@0xchloe/feed" },
];

interface Feed {
    label: string;
    href: string;
}

interface BlogPost {
    title: string;
    link: string;
    pubDate: string;
    description: string;
}

interface BlogPostWithFeed extends BlogPost {
    feedLabel: string;
}

export default function Page() {
    const [posts, setPosts] = React.useState<BlogPostWithFeed[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    useEffect(() => {
        let mounted = true;

        async function load() {
        try {
            const all: BlogPostWithFeed[] = [];
            for (const feed of RSSFEEDS) {
            try {
                const items: BlogPost[] = await fetchBlogPostsFromRSS(feed.href);
                items.forEach(item => all.push({ ...item, feedLabel: feed.label }));
            } catch (e) {
                console.error(`Failed to fetch ${feed.href}`, e);
            }
            }
            if (mounted) {
            // newest first
            all.sort((a,b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
            setPosts(all);
            }
        } catch (e) {
            if (mounted) setError(String(e));
        } finally {
            if (mounted) setLoading(false);
        }
        }

        load();
        return () => { mounted = false; };
    }, []);
    return (
            <div>
      <Navbar />
      <div>
        <h1 className={styles.title}>Blog Aggregator</h1>
        <p className={styles.genericbody}>This is a page to aggregate blog posts from all the places I post, which at the time of writing, is just on listed.to</p>

        <div className={`${styles.container} ${styles.postsGrid}`}>
          {loading && <p className={styles.genericbody}>Loading posts…</p>}
          {error && <p>Error loading posts: {error}</p>}
          {!loading && posts.length === 0 && <p>No posts found.</p>}

          {posts.map(post => (
            <div className={`${styles.card} ${styles.compactCard}`} key={post.link}>
              <h2 className={styles.postTitle}>
                <a href={post.link} target="_blank" rel="noopener noreferrer">{post.title}</a>
              </h2>
              <p><em>{new Date(post.pubDate).toLocaleDateString()}</em> — <small>{post.feedLabel}</small></p>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    }

async function fetchBlogPostsFromRSS(rssUrl: string): Promise<BlogPost[]> {
    const res = await fetch(rssUrl);
    if (!res.ok) {
        throw new Error(`Failed to fetch RSS feed: ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    return items.map(item => ({
        title: item.querySelector("title")?.textContent || "No title",
        link: item.querySelector("link")?.textContent || "#",
        pubDate: item.querySelector("pubDate")?.textContent || "",
        description: item.querySelector("description")?.textContent || "",
    }));

}