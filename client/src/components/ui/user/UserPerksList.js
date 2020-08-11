import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { addCart } from '../../../actions/cart'

const UserPerksList = ({ lan,has_perks,new_user,perks,addCart }) => {
  const state = {
    ui: {
      bg:['Имаш','Нямаш','бонуси!...','1 "Маргарита" Гратис!','Маргерита'],
      en:['You have', 'You have No', 'perks!...','Free "Margherita"!','Margherita'],
      es:['Tienes', 'No tienes', 'obsequios!','"Margherita" Gratis!','Margherita']
    }
  }
  return (
    <div>
      {has_perks ? (
        <div className='oval-but'>
          <Button color='orange'
            content={state.ui[lan][3]}
            onClick={ () => addCart(
              [{
                product: 1,
                quant: 1,
                name: state.ui[lan][4],
                price: 0,
                promo: 1
              }]
            )}
          />
        </div>
      ) :
      `${state.ui[lan][1]} ${state.ui[lan][2]}`}
    </div>
  )
}

export default connect(null, { addCart })(UserPerksList)
