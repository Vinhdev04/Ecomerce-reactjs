import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaTag,
    FaUser
} from 'react-icons/fa';
import BannerHome from '../BannerHome/BannerHome';
import Loading from '../Loading/Loading';
import newService from '@/api/newService';
import styles from './NewsDetail.module.scss';
import Layout from '@/components/Layout/Layout';
import imgConsole from '@images/Xbox Series X Controller - Electric.webp';
import imgReview from '@images/8BitDoUltimate.webp';
import imgService from '@images/DARE-U H101X.webp';

const getFallbackImage = (news) => {
    if (
        news?.image &&
        !(news.image.includes('images.unsplash.com') || news.image.includes('github.io'))
    ) {
        return news.image;
    }

    if (news?.category === 'Console News') {
        return imgConsole;
    }

    if (news?.category === 'Game Review') {
        return imgReview;
    }

    return imgService;
};

const getContentBlocks = (content = '') =>
    content
        .split('\n\n')
        .map((block) => block.trim())
        .filter(Boolean);

function NewsDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await newService.getNewsDetail(id);

                if (response.success) {
                    setArticle(response.data);
                } else {
                    setError('Failed to load article details.');
                }
            } catch (fetchError) {
                console.error('Failed to fetch article detail:', fetchError);
                setError('Failed to load article details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const contentBlocks = useMemo(
        () => getContentBlocks(article?.content),
        [article?.content]
    );

    if (loading) {
        return <Loading />;
    }

    if (error || !article) {
        return (
            <Layout>
            <div className={styles.page}>
                <BannerHome title="News Detail" desc="Read the full story behind each update." />
                <div className={styles.feedbackBox}>
                    <h2>{error || 'Article not found.'}</h2>
                    <Link to="/news" className={styles.backLink}>
                        <FaArrowLeft />
                        Back to News
                    </Link>
                </div>
            </div>
            </Layout>
        );
    }

    return (
        <Layout>
        <div className={styles.page}>
            <BannerHome title={article.title} desc={article.summary} />

            <div className={styles.container}>
                <Link to="/news" className={styles.backLink}>
                    <FaArrowLeft />
                    Back to News
                </Link>

                <article className={styles.article}>
                    <div className={styles.hero}>
                        <img
                            src={getFallbackImage(article)}
                            alt={article.title}
                            className={styles.heroImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/fallbacks/no-image-600x400.png';
                            }}
                        />
                    </div>

                    <div className={styles.metaRow}>
                        <span className={styles.category}>{article.category || 'News'}</span>
                        <span className={styles.metaItem}>
                            <FaCalendarAlt />
                            {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <span className={styles.metaItem}>
                            <FaUser />
                            {article.author}
                        </span>
                        {article.readTime ? (
                            <span className={styles.metaItem}>
                                <FaClock />
                                {article.readTime} min read
                            </span>
                        ) : null}
                    </div>

                    <div className={styles.summaryBox}>{article.summary}</div>

                    <div className={styles.content}>
                        {contentBlocks.map((block, index) =>
                            index % 2 === 0 ? (
                                <h2 key={`${index}-${block}`} className={styles.sectionTitle}>
                                    {block}
                                </h2>
                            ) : (
                                <p key={`${index}-${block}`} className={styles.paragraph}>
                                    {block}
                                </p>
                            )
                        )}
                    </div>

                    {article.tags?.length ? (
                        <div className={styles.tagsRow}>
                            <span className={styles.tagsLabel}>
                                <FaTag />
                                Topics
                            </span>
                            {article.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </article>
            </div>
        </div>
        </Layout>
    );
}

export default NewsDetail;
