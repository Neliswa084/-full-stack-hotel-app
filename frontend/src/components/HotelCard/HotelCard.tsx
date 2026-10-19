import { useNavigate } from 'react-router-dom'
import type { HotelCardData } from '../../types/hotel'
import styles from './HotelCard.module.css'

interface HotelCardProps {
  hotel: HotelCardData;
  isFavourite?: boolean;
  onToggleFavourite?: (hotelId: number) => void;
}

export const HotelCard = ({ hotel, isFavourite = false, onToggleFavourite }: HotelCardProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        {hotel.main_image ? (
          <img className={styles.image} src={hotel.main_image} alt={hotel.name} />
        ) : (
          <div className={styles.noImage}>No photo yet</div>
        )}

        {onToggleFavourite && (
          <button
            className={styles.heart}
            onClick={() => onToggleFavourite(hotel.id)}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {isFavourite ? '♥' : '♡'}
          </button>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <h3 className={styles.name}>{hotel.name}</h3>
          {hotel.average_rating && (
            <span className={styles.rating}>★ {hotel.average_rating}</span>
          )}
        </div>

        <p className={styles.city}>{hotel.city}</p>

        <div className={styles.tags}>
          {hotel.amenities.map((amenity) => (
            <span key={amenity} className={styles.tag}>{amenity}</span>
          ))}
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.price}>
            {hotel.price_from ? (
              <>
                <strong>R {Number(hotel.price_from).toLocaleString('en-ZA')}</strong>
                <span> / night</span>
              </>
            ) : (
              <span>No rooms yet</span>
            )}
          </p>
          <button className={styles.viewButton} onClick={() => navigate(`/hotels/${hotel.id}`)}>
            View
          </button>
        </div>
      </div>
    </div>
  )
}