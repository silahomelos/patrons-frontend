import React, { useEffect, useState } from 'react'
import Container from '@components/container'
import DAOCard from '@components/dao-card'
import Filters from '@components/filters'

import { filterDaos } from '@utils/helpers'

import daos from 'src/data/daos.json'
import styles from './styles.module.scss'

const DaosPage = () => {
  const [filter, setFilter] = useState('')
  const [categories, setCategories] = useState([])

  return (
    <div className={styles.wrapper}>
      <section className={styles.titleWrapper}>
        <div className={styles.title}>
          Explore & Patron
        </div>
        <p>
          Collector Daos
        </p>
      </section>

      <section className={styles.filterWrapper}>
        <Filters
          filter={filter}
          setFilter={setFilter}
          setCategories={setCategories}
          isDAO={true}
        />
      </section>

      <Container>
        <section className={styles.daosWrapper}>
          {
            filterDaos(daos, filter, categories).map(daoInfo => {
              return (
                <div key={daoInfo.name}>
                  <DAOCard
                    daoName={daoInfo.name}
                    tags={daoInfo.tags}
                    image={daoInfo.image}
                    borderColor={daoInfo.borderColor}
                    linkName={daoInfo.name}
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

export default DaosPage