import React from 'react'
import Banner from '@components/Banner/Banner.jsx';
import Heading from '@/components/Heading/Heading';
import Info from '@/components/Info/Info';
import HomeListProduct from '@/components/HomeListProduct/HomeListProduct';
import BannerHome from '@/components/BannerHome/BannerHome';
import Layout from '@/components/Layout/Layout';

function Home() {
  return (
    <Layout>
      <Banner />
      <Info />
      <Heading />
      <HomeListProduct />
      <BannerHome />
    </Layout>
  )
}

export default Home