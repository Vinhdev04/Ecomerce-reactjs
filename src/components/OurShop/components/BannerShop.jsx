import React, { useContext } from 'react'
import styles from "./BannerShop.module.scss"
import CalculatorTimer from '@components/Countdown/CalculatorTimer.jsx';
import bannerImage from "@images/Xbox Series X Controller - Electric.webp";
import { OurShopContext } from '@contexts/OurShopContext.js';
function BannerShop() {
    const {softOptions,showOptions} = useContext(OurShopContext);
    const {
        bannerSection,
        bannerContent,
        contentLeft,
        contentRight,
        badge,
        mainTitle,
        titleGradient,
        titleWhite,
        description,
        timerWrapper,
        timerLabel,
        buttonGroup,
        btnPrimary,
        btnSecondary,
        features,
        featureItem,
        featureValue,
        featureLabel,
        productWrapper,
        productImage,
        discountBadge,
        decorCircle1,
        decorCircle2
    } = styles;

        
    console.log("soft",softOptions);
    console.log("show",showOptions);

    return (
        <div className={bannerSection}>
            <div className={bannerContent}>
                {/* Left Content */}
                <div className={contentLeft}>
                    <span className={badge}>Limited Edition</span>
                    
                    <h1 className={mainTitle}>
                        <span className={titleGradient}>The Classics</span>
                        <span className={titleWhite}>Make A Comeback</span>
                    </h1>
                    
                    <p className={description}>
                        Experience gaming like never before with xPadgame controllers. 
                        Premium quality meets cutting-edge technology.
                    </p>

                    <div className={timerWrapper}>
                        <p className={timerLabel}>Deal Ends In:</p>
                        <CalculatorTimer endTime={new Date('2026-12-31T23:59:59')} />
                    </div>

                    <div className={buttonGroup}>
                        <button className={btnPrimary}>Buy Now</button>
                        <button className={btnSecondary}>Learn More</button>
                    </div>

                    <div className={features}>
                        <div className={featureItem}>
                            <p className={featureValue}>50+</p>
                            <p className={featureLabel}>Models</p>
                        </div>
                        <div className={featureItem}>
                            <p className={featureValue}>4.9★</p>
                            <p className={featureLabel}>Rating</p>
                        </div>
                        <div className={featureItem}>
                            <p className={featureValue}>10k+</p>
                            <p className={featureLabel}>Sold</p>
                        </div>
                    </div>
                </div>

                {/* Right Content - Product */}
                <div className={contentRight}>
                    <div className={productWrapper}>
                        <div className={productImage}>
                           
                            <img 
                                src={bannerImage}
                                alt="xPadgame Controller" 
                            />
                           
                            
                            <div className={discountBadge}>-30% OFF</div>
                        </div>
                        <div className={decorCircle1}></div>
                        <div className={decorCircle2}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BannerShop