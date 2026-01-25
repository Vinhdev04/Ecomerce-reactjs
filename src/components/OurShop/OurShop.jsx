import React from 'react'
import Layout from '@/components/Layout/Layout'
import styles from "./OurShop.module.scss"

function OurShop() {
  return (
    <Layout>
      <div className={styles.shopContainer}>
        <h1>Shop Page</h1>
        {/* Nội dung shop */}
      </div>
    </Layout>
  )
}

export default OurShop