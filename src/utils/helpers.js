export const reviseUrl = (url) => {
  if (url?.includes('gateway.pinata')) {
    return url.replace('gateway.pinata', 'digitalax.mypinata')
  }
  return url
}

export const getRarityId = (rarity) => {
  if (rarity === 'Exclusive') {
    return 1
  } else if (rarity === 'Semi-Rare' || rarity === 'Semi Rare') {
    return 2
  } else {
    return 3
  }
}

export const getRarity = (rarity) => {
  if (rarity === 1) {
    return 'Exclusive'
  } else if (rarity === 2) {
    return 'Semi Rare'
  } else {
    return 'Common'
  }
}

export const filterRealms = (realms, filter, categories) => {
  let filteredRealms = [...realms]
  if (categories && categories.length) {
    const categoryValues = categories.map(item => item.value.toLowerCase())
    filteredRealms = realms.filter(
      realm => realm.tags?.map(tag => tag.toLowerCase()).filter(tag => categoryValues.indexOf(tag) >= 0).length > 0
    )
  }

  if (filter.length) {
    const lowerCaseFilter = filter.toLowerCase()
    filteredRealms = filteredRealms.filter(
      (realm) =>
      realm.name.toLowerCase().includes(lowerCaseFilter) ||
      realm.designerId.toLowerCase().includes(lowerCaseFilter) ||
      realm.oldDesignerId?.toLowerCase().includes(lowerCaseFilter.toLowerCase())
    )
  }
  
  return filteredRealms
}

export const generateLookImage = (item) => {
  const { id, name, background, color, texture, pattern, shape, flare, form, line, element } = item

  const imageString = `
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>@import url("https://fonts.googleapis.com/css?family=Inknut+Antiqua:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic") .base { fill: white font-family: Inknut Antiqua font-size: 10.8px font-weight:bold }</style><rect width="100%" height="100%"
      fill="#${background}" /><text x="245" y="20" class="base"> LookBook #${id}</text>
      <text x="10" y="60" class="base">${pattern}</text>
      <text x="10" y="80" class="base">${texture}</text>
      <text x="10" y="100" class="base">${color}</text>
      <text x="10" y="120" class="base">${line}</text>
      <text x="10" y="140" class="base">${flare}</text>
      <text x="10" y="160" class="base">${shape}</text>
      <text x="10" y="180" class="base">${form}</text>
      <text x="10" y="200" class="base">${element}</text></svg>`

  return 'data:image/svg+xmlbase64,' + btoa(unescape(encodeURIComponent(imageString)))
}
