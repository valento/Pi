import React from 'react'
import { Button,Divider } from 'semantic-ui-react'

import BakerHome from './fac/BakerHome'
import AdminDashboard from './AdminDashboard'

const TesterHome = () => {
  return (
    <div className='oval-but'>
      <Divider horizontal>Tester Demo</Divider>
      <p>As a potential partner you can find your-self as a LAB-owner (BOSS),
        a FAC-owner (Baker) or Delivery-courier.<br/>
        Choose a Role to test:
      </p>
      <Button fluid color='black' content='Role: BOSS' /><br/>
      <Button fluid color='orange' content='Role: Baker' /><br/>
      <Button fluid color='gray' content='Role: Courier' /><br/>
      <Divider horizontal> --- </Divider>
    <p>To learn more about business Partner-options:</p>
      <Button color='blue' content='Business Plans'/>
    </div>
  )
}

const AllAdminHome = props => {

  const { member,id } = props

//  let role = Math.log2(member)

  return (
    <div className='init top-15 padded oval-but'>
      {member===(8 || 4) && <BakerHome id={id} />}
      {member===64 && <TesterHome />}
      <AdminDashboard {...props} />
    </div>
  )
}

export default AllAdminHome
