import React, { useEffect, useState } from 'react'
import { Router } from 'next/router'
import Head from 'next/head'

import Container from '@components/container'
import RealmCard from '@components/realm-card'
import Filters from '@components/filters'

import { filterRealms } from '@utils/helpers'

import realms from 'src/data/realms.json'
import styles from './styles.module.scss'

const LandingPage = () => {
  const [filter, setFilter] = useState('')
  const [categories, setCategories] = useState([])
  
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init('485692459240447')
        ReactPixel.pageView()

        Router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView()
        })
      })
  }, [])

  const structuredData = {
    '@context': 'http://schema.org',
    '@type': 'Skins Landing page',
    title: 'Digitalax - Web3 Fashion Economy',
    description:
      'Take your digital fashion skins to the next level: directly into indie games & mods, where players from amateur to pro can start to earn a livelihood through play, without sacrificing our love of the game. ESPA is the first casual esports platform, with direct integration with DIGITALAX NFT skins on Matic Network. ',
  }

  // console.log('products: ', products)

  return (
    <div className={styles.wrapper}>
      <Head>
        <meta
          name="description"
          content="Take your digital fashion skins to the next level: directly into indie games & mods, where players from amateur to pro can start to earn a livelihood through play, without sacrificing our love of the game. ESPA is the first casual esports platform, with direct integration with DIGITALAX NFT skins on Matic Network. "
        />
        <meta property="og:title" content="Digitalax - Web3 Fashion Economy" />
        <meta
          property="og:description"
          content="Take your digital fashion skins to the next level: directly into indie games & mods, where players from amateur to pro can start to earn a livelihood through play, without sacrificing our love of the game. ESPA is the first casual esports platform, with direct integration with DIGITALAX NFT skins on Matic Network. "
        />
        <meta property="og:url" content="https://marketplace.digitalax.xyz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ESPA4play" />
        <meta name="twitter:title" content="Skins Landing page" />
        <meta
          name="twitter:description"
          content="Take your digital fashion skins to the next level: directly into indie games & mods, where players from amateur to pro can start to earn a livelihood through play, without sacrificing our love of the game. ESPA is the first casual esports platform, with direct integration with DIGITALAX NFT skins on Matic Network. "
        />
        <script src="https://cdn.rawgit.com/progers/pathseg/master/pathseg.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <section className={styles.titleWrapper}>
        <div className={styles.title}>
          Explore & Patron
        </div>
        <p>
          Indie Web3 Fashion Realms
        </p>
      </section>

      <section className={styles.filterWrapper}>
        <Filters filter={filter} setFilter={setFilter} setCategories={setCategories} />
      </section>

      <Container>
        <section className={styles.realmsWrapper}>
          {
            filterRealms(realms, filter, categories).map(realm => {
              return (
                <div key={realm.name}>
                  <RealmCard
                    realmName={realm.name}
                    tags={realm.tags}
                    image={realm.image}
                    borderColor={realm.borderColor}
                    linkName={realm.name}
                  />
                </div>
              )
            })
          }
        </section>
      </Container>
    </div>
  )
}

export default LandingPage
