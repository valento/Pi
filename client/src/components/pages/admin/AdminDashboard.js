import React from 'react'
import { connect } from 'react-redux'
import { Divider,Grid,Icon } from 'semantic-ui-react'

const AdminDashboard = ({member,lan,customers,orders}) => {
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
    <div>
    <Divider horizontal>{ui[role]} Dashboard</Divider>
    <Grid className='nopadd'>
      <Grid.Row columns={2}>
        <Grid.Column>
          <Icon name='user' />
        </Grid.Column>
        <Grid.Column>
          <Icon name='clipboard list' />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <div className='circle-div'>
            <h2>{customers.length || 0}</h2>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div className='circle-div'>
            <h2>{orders || 100}</h2>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    </div>
  )
}

const mapStateToProps = state => ({
  customers: state.settings.customer_counter,
  orders: state.settings.order_counter
})
export default connect(mapStateToProps)(AdminDashboard)
