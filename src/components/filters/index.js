import React, { useState } from 'react'
import Select from 'react-select'
import styles from './styles.module.scss'
import realms from 'src/data/realms.json'
import daos from 'src/data/daos.json'

const Filters = ({ filter, setFilter, setCategories, isDAO }) => {
  const tags = isDAO
    ? daos.map(realm => realm.tags.map(tag => tag.toLowerCase()))
    : realms.map(dao => dao.tags.map(tag => tag.toLowerCase())) 

  const uniqueTags = tags.reduce((a, b) => [...new Set([...a,...b])]).sort()

  const [currentSelectedOptions, setCurrentSelectedOptions] = useState([])

  const filterItems = uniqueTags.map(tag => ({
    value: tag,
    label: tag
  }))

  const onChangeSelect = options => {
    console.log('options: ', options)
    setCurrentSelectedOptions(options)
    setCategories(options)
  }

  const customStyles = {
    container: styles => ({
      // ...styles,
      width: '100%'
    }),
    control: styles => ({
      ...styles,

      // none of react-select's styles are passed to <Control />
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none'
      // width: '100%',
    }),
    input: styles => ({
      ...styles,
      color: 'white'
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: 'black',
      border: '3px solid #FFFFFF',
      borderRadius: '21px',
      overflow: 'hidden'
      // position: 'absolute',
      // top: 0
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = data.color
      return {
        ...styles,
        backgroundColor: 'black',
      }
    },
    multiValue: (styles, { data }) => {
      // const color = chroma(data.color)
      return {
        ...styles,
        backgroundColor: 'white',
        color: 'black'
        // border: '1px solid white'
        // backgroundColor: color.alpha(0.1).css(),
      }
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white'
      }
    })
  }

  // console.log('currentSelectedOptions: ', currentSelectedOptions)

  return (
    <>
      <div className={styles.actions}>
        <div className={styles.filterWrapper}>
          <div className={styles.filterLabel}>
            filter
            <div className={styles.helper}>
              <span className={styles.questionMark}>?</span>
              <span className={styles.description}>
                FILTER BY DESIGNER, OUTFIT NAME OR COLLECTOR ID
              </span>
            </div>
          </div>
          <div className={styles.filterInput}>
            <input
              className={styles.filter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <img src="/images/filter1.png" />
          </div>
        </div>
        <div className={styles.sortWrapper}>
          <div className={styles.sortLabel}>Label Categories</div>
          <div className={styles.sortInput}>
            <Select
              isMulti
              value={currentSelectedOptions}
              onChange={onChangeSelect}
              options={filterItems}
              styles={customStyles}
              
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Filters
