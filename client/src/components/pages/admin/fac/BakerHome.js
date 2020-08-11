import React from 'react'
import { connect } from 'react-redux'
import { Button,Divider,Checkbox,Grid } from 'semantic-ui-react'
import { subscribeSocket,closeSocket,fireSocket } from '../../../../websocket'
import { socketCounter,setFac } from '../../../../actions/settup'

class BakerHome extends React.Component {
  state = {
    checkin: false,
    open: false,
    dlvr: false,
    pod: false,
    ui: {
      en:['SHUTDOWN','Rest','Controls:','ON','OFF','PoD','Delivery'],
      es:['CERRAR','Descanzo','Controles:','ON','OFF','PoD','Domicilio'],
      bg:['ЗАТВОРИ','Почивка','Контроли:','ON','OFF','PoD','Доставка']
    }
  }

// SOCKET ON!: Listen to baker-protocol channel:
// customers on-line and/or incoming orders
  onChange = (e,{name}) => {
    this.setState(prevState => ({[name]: !prevState[name]}))
    const { setFac,socketCounter,id } = this.props
    setFac({ data: {[name]: !this.state[name]}, id: id })
    switch(name) {
      case 'checkin' :
        if( !this.state.checkin ) {
          subscribeSocket(socketCounter)
        } else {
          closeSocket(id)
        }
      break
      case 'open' :
        fireSocket(null,JSON.stringify({fac: this.props.fac.id, open: !this.state.open}))
        //if ( this.state.open ) closeSocket(id)
      break
    }
  }

// Close everything:
  closeShop = (e,{ name }) => {
    this.props.setFac({
      id: this.props.id,
      data: {
        open: false,
        checkin: false
      }
    })
    fireSocket(null,JSON.stringify({fac: this.props.fac.id, open: false}))

    //this.props.socketCounter({ customer_counter: 0 })

    this.setState(prevState => ({
      open: false,
      checkin: name==='close'? false : prevState.checkin
    }))
  }

  switchPod = () => {
    this.setState(prevState => ({pod: !prevState.pod}))
    //this.props.setFac({
    //  id: this.props.id,
    //  pod: this.state.pod
    //})
  }

  componentDidMount = () => {
    console.log('Baker Home: ',this.props.fac)
    const { checkin,open,delivery } = this.props.fac
    this.setState({
      checkin: !!checkin,
      open: !!open,
      dlvr: delivery===4? false : true
    })
  }

  render() {
    const ui = this.state.ui[this.props.lan]
    const { open,checkin,dlvr,pod } = this.state
    return (
    <div className='oval-but'>
      <Divider horizontal>{ui[2]}</Divider>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Checkbox name='checkin'
              checked={checkin}
              disabled={open}
              label={<label>{checkin? 'Check-out' : 'Check-in'}</label>}
              onChange={this.onChange} toggle
            />
          </Grid.Column>
          <Grid.Column>
            <Checkbox name='open'
              checked={open}
              disabled={!checkin}
              label={<label>{open? 'Close' : 'Open'}</label>}
              onChange={this.onChange} toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <br/>
{/* ===== FAC CONTROLS ============================= */}
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Button fluid color='blue'
              icon='motorcycle'
              disabled={!checkin || this.props.fac.delivery === 4}
              content={dlvr? `${ui[6]}: ${ui[4]}` : `${ui[6]}: ${ui[3]}`}
              onClick={this.closeShop}
            />
          </Grid.Column>
          <Grid.Column>
            <Button fluid color='grey'
              icon='sign-out'
              disabled={true}
              content={pod? `${ui[5]}: ${ui[4]}` : `${ui[5]}: ${ui[3]}`}
              onClick={this.switchPod}
            />
        </Grid.Column>
        </Grid.Row>
      </Grid>
      <br/>
      <Button fluid color='grey'
        name='pause'
        icon='pause'
        content={ui[1]}
        disabled={true}//!open
        onClick={this.closeShop}
      />
      <br/>
      <Button fluid color='red'
        name='close'
        icon='attention'
        disabled={!open || !checkin}
        content={ui[0]}
        onClick={this.closeShop}
      />
    </div>
  )}
}

const mapStateToProps = state => ({
  lan: state.settings.lan,
  fac: state.facs
})

export default connect(mapStateToProps,{ socketCounter,setFac })(BakerHome)
