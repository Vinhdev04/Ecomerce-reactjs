import React, { useEffect, useState } from 'react';
import newService from '@/api/newService';
import styles from './News.module.scss';
import { FaNewspaper, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Loading from '../Loading/Loading';
import Heading from '../Heading/Heading';
import BannerHome from '../BannerHome/BannerHome';

function News() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await newService.getAllNews();
                if (response.success) {
                    setNewsList(response.data);
                } else {
                    setError('Failed to load news.');
                }
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setError('Failed to load news. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <BannerHome title="Latest News" />
                <div className={styles.content} style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2 style={{ color: '#ff4d4f' }}>{error}</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
             <BannerHome 
                title="Latest News" 
                desc="Stay updated with the latest gaming news and announcements." 
            />
            
            <div className={styles.content}>
                <Heading title="Gaming News" />
                
                <div className={styles.gridContainer}>
                    {newsList.map((news) => (
                        <div key={news.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img 
                                    src={news.image} 
                                    alt={news.title} 
                                    className={styles.newsImage} 
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/600x400?text=No+Image';
                                    }}
                                />
                                <span className={styles.category}>{news.category || 'News'}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.meta}>
                                    <span className={styles.metaItem}>
                                        <FaCalendarAlt className={styles.icon} />
                                        {new Date(news.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <FaUser className={styles.icon} />
                                        {news.author}
                                    </span>
                                </div>
                                <h3 className={styles.title}>{news.title}</h3>
                                <p className={styles.summary}>{news.summary}</p>
                                <button className={styles.readMoreBtn}>Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default News;
