import React from 'react'
import { Divider } from 'semantic-ui-react'

const AdminDashboard = ({member,lan}) => {
  const state = {
    ui: {
      en:['Boss','Lab','Fac','Baker','Courier','Tester'],
      es:['Boss','Lab','Fac','Baker','Courier','Tester'],
      bg:['Boss','Lab','Fac','Baker','Courier','Tester']
    }
  }
  const ui = state.ui[lan]
  let role = Math.log2(member)
  return (
    <Divider horizontal>{ui[role]} Dashboard</Divider>
  )
}

export default AdminDashboard
