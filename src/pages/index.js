import React, { useEffect } from 'react'
import { Router } from 'next/router'
import Head from 'next/head'
import styles from './styles.module.scss'
import Button from '@components/buttons/button'

const LandingPage = () => {
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
        <meta property="og:title" content="Digitalax - Patron Web3 Fashion Realms" />
        <meta
          property="og:description"
          content="Take your digital fashion skins to the next level: directly into indie games & mods, where players from amateur to pro can start to earn a livelihood through play, without sacrificing our love of the game. ESPA is the first casual esports platform, with direct integration with DIGITALAX NFT skins on Matic Network. "
        />
        <meta property="og:url" content="https://marketplace.digitalax.xyz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ESPA4play" />
        <meta name="twitter:title" content="Patrons Landing page" />
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
          Indie Web3 Fashion
        </div>
        <p>
          Patrons & Collector DAOs
        </p>
      </section>

      <section className={styles.contentWrapper}>
        <div className={styles.description}>
          A federated model of countless DAOs learning from and mutually assisting each other through hypergrowth network effects is far better than any one DAO to rule them all, let alone one DAO to collect mostly the old symbols of corporate luxury, wealth, and power. 
          <br /><br />
          The formation of dedicated Web3 Fashion Collector DAOs and Patrons cultivates the indie designer network and an entire economy of tools, services, guidance, and capital savvy.
        </div>
        <div className={styles.buttons}>
          <Button
            background='black'
            className={styles.button}
            onClick={() => {
              window.open('/daos', '_self')
            }}
          >
            join indie web3 fashion collector daos
          </Button>
          <Button
            background='black'
            className={styles.button}
            onClick={() => {
              window.open('/realms', '_self')
            }}
          >
            Patron indie web3 fashion labels
          </Button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
