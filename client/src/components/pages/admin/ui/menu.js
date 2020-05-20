import React from 'react'

import MainMenu from './mainMenu'
import SubMenu from './subMenu'

const AdminMenu = ({lan,main,onMenu}) => {
  return (
    <div className='menu-bar extra-padded'>
      {main?
        <MainMenu lan={lan} /> :
        <SubMenu lan={lan} onMenu={onMenu} />}
    </div>
  )
}

export default AdminMenu
