import React, { useEffect } from 'react'
import { Router } from 'next/router'
import Head from 'next/head'

import Container from '@components/container'
import RealmCard from '@components/realm-card'

import styles from './styles.module.scss'

const LandingPage = () => {
  const realms = [
    {
      name: 'ALTERRAGE',
      image: '/images/realm-avatars/realm_aleterage.png',
      borderColor: 'linear-gradient(136.5deg, #FF7A00 0%, #874100 48%, #AA7A00 102.4%)',
      link: 'alterage'
    },
    {
      name: 'Phoebe Heess',
      image: '/images/realm-avatars/realm_phoebe.png',
      borderColor: 'linear-gradient(136.5deg, #FFFFFF 0%, #949494 48%, #2B230F 102.4%)',
      link: 'alterage'
    },
    {
      name: 'Alana',
      image: '/images/realm-avatars/realm_alana.png',
      borderColor: 'linear-gradient(136.5deg, #EB00FF 0%, #4D0241 48%, #DA0069 102.4%)',
      link: 'alterage'
    },
    {
      name: 'T3CHN0M0RPH',
      image: '/images/realm-avatars/realm_T3CHN0M0RPH.png',
      borderColor: 'linear-gradient(136.5deg, #0500FF 0%, #322820 48%, #3C3AB7 102.4%)',
      link: 'alterage'
    }
  ]
  
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

      <Container>
        <section className={styles.realmsWrapper}>
          {
            realms.map(realm => {
              return (
                <>
                  <RealmCard
                    realmName={realm.name}
                    image={realm.image}
                    borderColor={realm.borderColor}
                    linkName={realm.link}
                  />
                </>
              )
            })
          }
        </section>
      </Container>
    </div>
  )
}

export default LandingPage
