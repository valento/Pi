import React from 'react'

const Product = ({ entry,mode }) => {
  let IMAGE_FOLDER = ['pizza','pi2','drinks','pivo','sauce']
  const style = {
    backgroundImage: `url(img/${IMAGE_FOLDER[entry.category-1]}/${entry.list}.png)`,
    backgroundSize: 'cover'
  }
  let dscr = entry.dscr.split(',').join(', ')
  return (
    <div className={mode==='ver'? 'item' : 'product'} style={style}>
      <span>{entry.name}</span>
        <span
          style={{
              maxWidth: '380px',
              display: 'flex',
              color: 'white',
              overflowX: 'hidden',
              backgroundColor: 'rgba(180,90,0,.5)'
            }}>
          {dscr}
        </span>
    </div>
  )
}

export default Product
