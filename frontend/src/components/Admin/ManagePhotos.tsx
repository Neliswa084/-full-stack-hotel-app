import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { fetchPhotos, addPhoto, updatePhoto, deletePhoto } from '../../redux/reducers/photosSlice'
import styles from './ManageHotel.module.css'

export const ManagePhotos = ({ hotelId }: { hotelId: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { photos, error } = useSelector((state: RootState) => state.photos)

  const [imageUrl, setImageUrl] = useState('')
  const [isMain, setIsMain] = useState(false)

  useEffect(() => {
    dispatch(fetchPhotos(hotelId))
  }, [dispatch, hotelId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await dispatch(
      addPhoto({ hotelId, photo: { image_url: imageUrl, is_main_image: isMain } })
    )

    if (result.meta.requestStatus === 'fulfilled') {
      setImageUrl('')
      setIsMain(false)
      dispatch(fetchPhotos(hotelId))
    }
  }

  const handleSetMain = async (photo: any) => {
    await dispatch(
      updatePhoto({
        id: photo.id,
        photo: { image_url: photo.image_url, is_main_image: true, display_order: photo.display_order },
      })
    )
    dispatch(fetchPhotos(hotelId))
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this photo?')) return
    await dispatch(deletePhoto(id))
    dispatch(fetchPhotos(hotelId))
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Photos</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleAdd}>
        <input
          placeholder="Paste image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={isMain} onChange={(e) => setIsMain(e.target.checked)} />
          Main photo
        </label>
        <button type="submit" className={styles.primaryButton}>Add photo</button>
      </form>

      {photos.length === 0 ? (
        <p className={styles.empty}>No photos yet.</p>
      ) : (
        <div className={styles.photoGrid}>
          {photos.map((photo) => (
            <div key={photo.id} className={styles.photoCard}>
              <img src={photo.image_url} alt="Hotel" className={styles.photo} />
              {photo.is_main_image && <span className={styles.mainBadge}>Main</span>}
              <div className={styles.photoButtons}>
                {!photo.is_main_image && (
                  <button className={styles.lightButton} onClick={() => handleSetMain(photo)}>Set as main</button>
                )}
                <button className={styles.dangerButton} onClick={() => handleDelete(photo.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}