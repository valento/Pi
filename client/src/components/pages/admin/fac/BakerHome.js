import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Checkbox,Grid } from 'semantic-ui-react'
import { subscribeSocket,fireSocket,closeSocket } from '../../../../websocket'
import { countNewOrders,countNewFacCustomers,setFac } from '../../../../actions/settup'

class BakerHome extends React.Component {
  state = {
    checkin: false,
    open: false
  }

  onChange = (e,{name}) => {
    this.setState(prevState => ({[name]: !prevState[name]}))
    this.props.setFac({data: {[name]: !this.state[name]}, id: this.props.id })
    if( name==='checkin' && !this.state.checkin ) {
      subscribeSocket(this.props.countNewOrders)
    } else if( name==='open' && this.state.open ) {
      closeSocket(this.props.id)
    }
  }

  render() {
    return (
    <div className='oval-but'>
      <Divider horizontal>Baker Controls</Divider>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Checkbox name='checkin'
              disabled={this.state.open}
              label={<label>{this.state.checkin? 'Check-out' : 'Check-in'}</label>}
              onChange={this.onChange} toggle
            />
          </Grid.Column>
          <Grid.Column>
            <Checkbox name='open'
              disabled={!this.state.checkin}
              label={<label>{this.state.open? 'Close' : 'Open'}</label>}
              onChange={this.onChange} toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid><br/>
      <Button fluid color='orange' content='CLOSE' /><br/>
      <Button fluid color='gray' content='PAUSE' />
    </div>
  )}
}

export default connect(null,{ countNewOrders,countNewFacCustomers,setFac })(BakerHome)
