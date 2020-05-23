import React from 'react'

const UserPerksList = ({ lan,has_perks,new_user,perks }) => {
  const state = {
    ui: {
      bg:['Имаш','Нямаш','бонуси!...'],
      en:['You have', 'You have No', 'perks!...'],
      es:['Tienes', 'No tienes', 'obsequios!']
    }
  }
  return (
    <div>
      {(has_perks || new_user) ? `${state.ui[lan][0]} ${perks.length} ${state.ui[lan][2]}` :
      `${state.ui[lan][1]} ${state.ui[lan][2]}`}
    </div>
  )
}

export default UserPerksList
