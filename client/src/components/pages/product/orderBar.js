import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon,Button } from 'semantic-ui-react'

const OrderBar = ({ open,mode,lan,onAddItem }) => {
  const initState = {
    ui: {
      en:['Add','Cart','See','','',''],
      es:['Añadir','Orden','Ver','','',''],
      bg:['Прибави','Поръчка','Виж','','','']
    }
  }

  const [countItem,setCounter] = useState(0)
//<input type='text' name='counter' maxLength='1' size='2' />
  return (
    <div className='bottom-div'>
      { mode==='ver' && open &&
        <div className='counter-bar'>
          <Button.Group size='mini' color='grey' inverted>
            <Button
              disabled={!open}
              onClick={ e=> setCounter(countItem<1? 0 : countItem-1) }
              icon='minus'/>
            <Button style={{backgroundColor: 'white', color: 'black'}} content={countItem} />
            <Button
              disabled={!open}
              onClick={ e=> setCounter(countItem>4? 5 : countItem+1) }
              icon='plus' />
          </Button.Group>
        </div>
      }
      {/*<Button size='small' color='black' basic
        disabled={!open}
        content={mode==='ver'? initState.ui[lan][0] : initState.ui[lan][2]}
        as={Link} to={mode==='ver'? '/order' : '/catalog'}
        onClick={ e => console.log(e.target) }
      />*/}
      <div className='counter-right'>

        <Button size='mini' color='orange' active
          as={mode==='hor'? Link : Button}
          to={mode==='hor'? '/catalog' : null}
          disabled={countItem===0}
          onClick={ e => {
            if(mode==='hor') return
            onAddItem(countItem)
          } }
          icon={mode==='ver'? 'cart arrow down' : 'eye'}
          content={mode='ver'? initState.ui[lan][0] : initState.ui[lan][2]}
        />

      </div>
    </div>
  )
}

export default connect(null)(OrderBar)

/*
<Button size='mini' color='orange'
  disabled={!open&&!countItem}
  onClick={ e => console.log(countItem) }
  icon='minus circle'
/>
*/
