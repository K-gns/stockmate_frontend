// Next Imports
import Image from 'next/image'

const StockMateLogo = (props: any) => {
  return (
    <Image
      src="/logos/stockmate_logo_color.png"
      alt="Logo"
      width={50}
      height={50}
      {...props}
    />
  )
}

export default StockMateLogo
