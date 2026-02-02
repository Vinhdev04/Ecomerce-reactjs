import React, { useState } from 'react';
import styles from './Contact.module.scss';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import Layout from '@/components/Layout/Layout';
import classNames from 'classnames';

const ContactPage = () => {
    const {
        contactContainer,
        contentWrapper,
        infoSection,
        contactDetails,
        detailItem,
        iconBox,
        infoContent,
        formSection,
        formTitle,
        formGroup,
        submitBtn
    } = styles;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle submit logic here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Layout>
            <div className={contactContainer}>
                <div className={contentWrapper}>
                    {/* Left Side - Contact Info */}
                    <div className={infoSection}>
                        <h2>Get in <span>Touch</span></h2>
                        <p>
                            Have questions about our premium gaming gear? We're here to help! 
                            Reach out to us for support, partnerships, or just to say hello.
                        </p>

                        <div className={contactDetails}>
                            <div className={detailItem}>
                                <div className={iconBox}>
                                    <FaMapMarkerAlt />
                                </div>
                                <div className={infoContent}>
                                    <h3>Address</h3>
                                    <p>123 Gaming Street, Tech District, HCM City, Vietnam</p>
                                </div>
                            </div>

                            <div className={detailItem}>
                                <div className={iconBox}>
                                    <FaPhoneAlt />
                                </div>
                                <div className={infoContent}>
                                    <h3>Phone</h3>
                                    <p>+84 123 456 789</p>
                                </div>
                            </div>

                            <div className={detailItem}>
                                <div className={iconBox}>
                                    <FaEnvelope />
                                </div>
                                <div className={infoContent}>
                                    <h3>Email</h3>
                                    <p>support@premiumgamexbox.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className={formSection}>
                        <h3 className={formTitle}>Send us a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={formGroup}>
                                <label>Your Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Enter your name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={formGroup}>
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={formGroup}>
                                <label>Subject</label>
                                <input 
                                    type="text" 
                                    name="subject" 
                                    placeholder="How can we help?" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={formGroup}>
                                <label>Message</label>
                                <textarea 
                                    name="message" 
                                    placeholder="Write your message here..." 
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className={submitBtn}>
                                Send Message <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactPage;
