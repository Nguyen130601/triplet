import { useState } from 'react'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap'
const DeletePopover = () => {
  const [popOverOpen, setPopOverOpen] = useState(false)
  return (
    <div>
      <Button
        id="Popover1"
        type="button"
      >
        Launch Popover
      </Button>
      <Popover
        flip
        placement="bottom"
        target="Popover1"
        toggle={() => setPopOverOpen(!popOverOpen)}
      >
        <PopoverHeader>
          Popover Title
        </PopoverHeader>
        <PopoverBody>
          Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
        </PopoverBody>
      </Popover>
    </div>
  )
}
export default DeletePopover