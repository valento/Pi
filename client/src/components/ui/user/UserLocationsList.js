import React from 'react'
import LocationRow from './LocRow'

const UserLocations = ({stat,view,lan,list,onLocationClick,current}) => {
  const ui = {
    en: ['No Locations'],
    es: ['No tienes Direccion'],
    bg: ['Нямаш Адрес!']
  }
  return (
    <div className={!list? 'order-list empty' : 'order-list'}>
      {!list || list.length===0?
        <div>{ui[lan][0]}</div> :
        <div>
          {list.map( (entry,ind) => {
            return <LocationRow
                key={ind}
                ind={ind}
                prime={entry.prime}
                current={current}
                onLocationClick={onLocationClick}
                lan={lan}
                row={entry}
                view={view}
                edit={true}
                stat={stat}
              />
            })
          }
        </div>
      }
    </div>
  )
}

export default UserLocations
