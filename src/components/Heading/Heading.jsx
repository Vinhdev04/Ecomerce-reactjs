import React from 'react';
import styles from './Heading.module.scss';
import Layout from '@/components/Layout/Layout';
function Heading() {
    const { containerX, containerBox, title, desc, headline } = styles;
    return (
        <Layout>
            <div className={containerX}>
                <div className={headline}></div>
                <div className={containerBox}>
                    <p className={desc}>don't miss super offer</p>
                    <h6 className={title}>Our of best product</h6>
                </div>
                <div className={headline}></div>
            </div>
        </Layout>
    );
}

export default Heading;
