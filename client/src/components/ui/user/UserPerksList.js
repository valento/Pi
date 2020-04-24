import React from 'react'

const UserPerksList = ({ has_perks,new_user,perks }) => {
  return (
    <div>
      You have {(has_perks || new_user) ? perks.length : 'No'} Perks
    </div>
  )
}

export default UserPerksList
