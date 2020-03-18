import React from 'react'
import { Button,Icon,Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import LocationRow from './LocRow'

const UserLocations = ({stat,view,lan,list,city,onLocation,current,disabled}) => {
  const ui = {
    en: ['No Locations','Address','Без доставка!'],
    es: ['No tienes Dirección','Dirección','Без доставка!'],
    bg: ['Нямаш Адрес!','Адрес','Без доставка!'],
    error: {
      en: ['No Delivery Service!','Your Location has no Delivery Service! Take your pizza from: '],
      es: ['Sin Domcilio!','Esta localidad no tiene servicio a Domicilio. Recibe su pizza a la dirección: '],
      bg: ['Без доставки','Този район е без доставка! Вземи своята пица от: ']
    }
  }
  return (
    <div className={(!list || list.length === 0)? 'order-list empty' : 'order-list'}>
      {disabled && <Message negative>
        <Message.Header>{ui.error[lan][0]}</Message.Header>
        <p>{ui.error[lan][1]}</p>
      </Message>}
      {(!disabled && (!list || list.length === 0)) ?
        <div>
          <div>{ui[lan][0]}</div><br/>
          <div className='oval-but'><Button as={Link} to='../user/locations' color='red' icon='warning sign' content={ui[lan][1]} /></div>
        </div> :
        <div>
          {list.forEach( (entry,ind) => {
            if(entry.city === city) {
              return <LocationRow
                  key={ind}
                  ind={ind}
                  prime={entry.prime}
                  current={current}
                  locClick={onLocation}
                  lan={lan}
                  row={entry}
                  view={view}
                  edit={true}
                  stat={stat}
                />
            }
            })
          }
        </div>
      }
    </div>
  )
}

export default UserLocations
