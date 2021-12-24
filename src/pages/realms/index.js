import React, { useEffect, useState } from 'react'
import Container from '@components/container'
import RealmCard from '@components/realm-card'
import Filters from '@components/filters'

import { filterRealms } from '@utils/helpers'

import realms from 'src/data/realms.json'
import styles from './styles.module.scss'

const RealmsPage = () => {
  const [filter, setFilter] = useState('')
  const [categories, setCategories] = useState([])

  return (
    <div className={styles.wrapper}>
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

export default RealmsPage