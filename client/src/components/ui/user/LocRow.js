import React from 'react'
import { Link } from 'react-router-dom'
import { Icon,Checkbox } from 'semantic-ui-react'

const LocationRow = ({ind,prime,lan,view,row,stat,edit,locClick,current}) => {
  console.log('ULocation row: ',current,row.location,row.prime)
  const addstyle = row.prime? ' selected-row' : ''
  return (
    <div className={'ui grid item'+addstyle}>
      <div className='two wide column nopad items'>
        {!stat && prime? <Icon name='pin' /> : ''}
        {stat && view==='select' &&
          <Checkbox
            checked={current===row.location || !!row.prime&&current===0}//
            onChange={()=>locClick(row.location)}
          />}
      </div>
      <div className='eight wide column nopad'>{row.street}</div>
      <div className='two wide column nopad'>{row.number||row.location}</div>
      <div className='two wide column nopad'>
        {!stat && <span basic onClick={null}><Icon color='red' name='minus circle' /></span>}
      </div>
      <div className='two wide column nopad'>
        {edit && <Link to={'/user/location/'+ind}><Icon color='blue' name='pencil' /></Link>}
      </div>
    </div>
  )
}

export default LocationRow
