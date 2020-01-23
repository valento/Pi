import React from 'react'
import { Label } from 'semantic-ui-react'

const Sign = ({size}) => {
  return (
    <Label size={size} circular basic>
      &pi;
    </Label>
  )
}

export default Sign

/*
<Label size={size} circular basic>
  &pi;
</Label>
*/
