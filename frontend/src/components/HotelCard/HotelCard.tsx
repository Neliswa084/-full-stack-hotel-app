import React from 'react'
import type { HotelCardData } from '../../types/hotel'

interface HotelCardProps {
    hotel: HotelCardData

}

export const HotelCard : React.FC<HotelCardData> = () => {
  return (
    <div>HotelCard</div>
  )
}
