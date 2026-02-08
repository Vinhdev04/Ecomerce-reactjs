import React, { useEffect } from 'react';
import { FaShippingFast, FaHeadset, FaUndo, FaShieldAlt, FaUsers, FaAward, FaSmile, FaRocket, FaHeart, FaLightbulb } from 'react-icons/fa';
import styles from './About.module.scss';
import bannerImg from '@images/banner.jpg';
import storyImg from '@images/Xbox Series X Controller.webp'; // Ảnh mới cho Story section
import missionImg from '@images/Xbox Series X Controller-02.webp'; // Ảnh minh họa cho Mission
import visionImg from '@images/8BitDoUltimate-02.webp'; // Ảnh minh họa cho Vision

const About = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            id: 1,
            icon: <FaShippingFast />,
            title: 'Giao Hàng Nhanh Chóng',
            desc: 'Miễn phí vận chuyển đơn từ 500k. Giao nội thành trong 2h.',
        },
        {
            id: 2,
            icon: <FaHeadset />,
            title: 'Hỗ Trợ 24/7',
            desc: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng hỗ trợ bạn bất cứ lúc nào.',
        },
        {
            id: 3,
            icon: <FaUndo />,
            title: 'Đổi Trả 30 Ngày',
            desc: 'Yên tâm mua sắm với chính sách đổi trả linh hoạt và minh bạch.',
        },
        {
            id: 4,
            icon: <FaShieldAlt />,
            title: 'Bảo Mật Tuyệt Đối',
            desc: 'Thông tin thanh toán được mã hóa và bảo vệ theo tiêu chuẩn quốc tế.',
        },
    ];

    const stats = [
        { id: 1, number: '10k+', label: 'Khách Hàng Tin Dùng', icon: <FaUsers /> },
        { id: 2, number: '500+', label: 'Sản Phẩm Gaming', icon: <FaRocket /> },
        { id: 3, number: '10+', label: 'Năm Kinh Nghiệm', icon: <FaAward /> },
        { id: 4, number: '99%', label: 'Đánh Giá 5 Sao', icon: <FaSmile /> },
    ];

    const coreValues = [
        {
            id: 1,
            icon: <FaLightbulb />,
            title: 'Sáng Tạo',
            desc: 'Không ngừng đổi mới để mang đến những sản phẩm công nghệ tiên tiến nhất.',
        },
        {
            id: 2,
            icon: <FaHeart />,
            title: 'Tận Tâm',
            desc: 'Khách hàng là trung tâm. Chúng tôi phục vụ bằng cả trái tim.',
        },
        {
            id: 3,
            icon: <FaUsers />,
            title: 'Cộng Đồng',
            desc: 'Xây dựng cộng đồng game thủ văn minh, kết nối và chia sẻ đam mê.',
        },
    ];

    return (
        <div className={styles.aboutContainer}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>XPAD GAME STORE</h1>
                    <p>Nâng Tầm Trải Nghiệm Gaming Của Bạn</p>
                    <div className={styles.heroLine}></div>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                {/* Story Section */}
                <section className={styles.section} id="story">
                    <div className={`${styles.gridTwoCol} ${styles.reverseMobile}`}>
                        <div className={styles.textBlock}>
                            <h4 className={styles.subHeading}>Câu Chuyện Của Chúng Tôi</h4>
                            <h2 className={styles.heading}>Khởi Nguồn Đam Mê</h2>
                            <p className={styles.desc}>
                                XPAD Game Store được thành lập vào năm 2010, bắt nguồn từ niềm đam mê cháy bỏng với thế giới game và công nghệ của một nhóm game thủ trẻ.
                                Chúng tôi hiểu rằng, một thiết bị tốt không chỉ là công cụ giải trí mà còn là người bạn đồng hành, là vũ khí đắc lực trong những trận chiến cam go.
                            </p>
                            <p className={styles.desc}>
                                Trải qua hơn một thập kỷ phát triển, từ một cửa hàng nhỏ, XPAD đã vươn mình trở thành hệ thống phân phối Gaming Gear hàng đầu,
                                là điểm đến tin cậy của hàng ngàn game thủ trên khắp cả nước.
                            </p>
                        </div>
                        <div className={styles.imageBlock}>
                            <div className={styles.imageWrapper}>
                                <img src={storyImg} alt="Our Story" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className={`${styles.section} ${styles.bgLight}`} id="mission-vision">
                    <div className={styles.innerContainer}>
                        <div className={styles.gridTwoCol}>
                            <div className={styles.imageBlock}>
                                 <div className={`${styles.imageWrapper} ${styles.tiltLeft}`}>
                                    <img src={missionImg} alt="Mission" />
                                </div>
                            </div>
                            <div className={styles.textBlock}>
                                <div className={styles.mvItem}>
                                    <h3 className={styles.mvTitle}><FaRocket className={styles.icon} /> Sứ Mệnh</h3>
                                    <p>
                                        Cung cấp các sản phẩm Gaming Gear chính hãng, chất lượng cao với mức giá hợp lý nhất, giúp game thủ Việt Nam tiếp cận dễ dàng với công nghệ thế giới.
                                    </p>
                                </div>
                                <div className={styles.mvItem}>
                                    <h3 className={styles.mvTitle}><FaLightbulb className={styles.icon} /> Tầm Nhìn</h3>
                                    <p>
                                        Trở thành hệ sinh thái Gaming Gear số 1 tại Việt Nam, nơi không chỉ bán sản phẩm mà còn cung cấp các giải pháp, dịch vụ và sân chơi cho cộng đồng game thủ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className={styles.section} id="values">
                    <div className={styles.centerText}>
                        <h4 className={styles.subHeading}>Giá Trị Cốt Lõi</h4>
                        <h2 className={styles.heading}>Điều Gì Làm Nên XPAD?</h2>
                    </div>
                    <div className={styles.valuesGrid}>
                        {coreValues.map(val => (
                            <div key={val.id} className={styles.valueCard}>
                                <div className={styles.valueIcon}>{val.icon}</div>
                                <h3>{val.title}</h3>
                                <p>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <section className={styles.statsSection}>
                    <div className={styles.statsOverlay}></div>
                    <div className={styles.statsContent}>
                        {stats.map((item) => (
                            <div key={item.id} className={styles.statItem}>
                                <div className={styles.statIcon}>{item.icon}</div>
                                <h3 className={styles.statNumber}>{item.number}</h3>
                                <p className={styles.statLabel}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className={`${styles.section} ${styles.bgLight}`} id="features">
                    <div className={styles.innerContainer}>
                        <div className={styles.centerText}>
                            <h2 className={styles.heading}>Tại Sao Chọn Chúng Tôi?</h2>
                            <p className={styles.subDesc}>Chúng tôi cam kết mang lại giá trị tốt nhất cho khách hàng</p>
                        </div>
                        <div className={styles.featuresGrid}>
                            {features.map((feature) => (
                                <div key={feature.id} className={styles.featureCard}>
                                    <div className={styles.featureIcon}>{feature.icon}</div>
                                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                                    <p className={styles.featureDesc}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Founder */}
                <section className={styles.section} id="founder">
                    <div className={styles.founderBox}>
                        <blockquote>
                            "Chúng tôi không chỉ bán sản phẩm, chúng tôi bán niềm vui và trải nghiệm chiến thắng."
                        </blockquote>
                        <div className={styles.signature}>
                            <p>CEO & Founder</p>
                            <h3>Vinh Dev</h3>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
