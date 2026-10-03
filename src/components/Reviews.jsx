import useReveal from '../lib/useReveal'
import './Reviews.css'

const REVIEWS = [
  {
    image: '/reviews/ethan.jpg',
    name: 'Ethan R.',
    rating: 5,
    text: 'Gilded Oud feels like a heirloom treasure — rich, warm, and luxurious from the first spray to the last.',
  },
  {
    image: '/reviews/maya.jpg',
    name: 'Maya L.',
    rating: 5,
    text: 'Pearl Bloom is my signature jewel scent. Soft, elegant, and unforgettable in the best way.',
  },
  {
    image: '/reviews/priya.jpg',
    name: 'Priya K.',
    rating: 5,
    text: 'Ruby Royale smells couture. It feels premium, polished, and like a statement piece in my collection.',
  },
  {
    image: '/reviews/jordan.jpg',
    name: 'Jordan B.',
    rating: 4,
    text: 'Blue Jewel is refined and fresh without feeling plain. It has a beautifully polished finish.',
  },
]

const Star = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#e0a951' : 'none'}>
    <path
      d="M12 2.5l2.9 6.4 7 .7-5.3 4.7 1.6 6.9-6.2-3.7-6.2 3.7 1.6-6.9L2.1 9.6l7-.7L12 2.5Z"
      stroke="#e0a951"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
)

const Reviews = () => {
  const sectionRef = useReveal([
    { selector: '.reviews-kicker, .reviews-heading', y: 40, duration: 0.8 },
    { selector: '.review-card', y: 60, scale: 0.9, duration: 0.7, stagger: 0.1, start: 'top 78%' },
  ])

  return (
    <section className="reviews" id="reviews" ref={sectionRef}>
      <span className="reviews-kicker">Customer Love</span>
      <h2 className="reviews-heading">What Our Customers Say</h2>
      <div className="reviews-grid">
        {REVIEWS.map((r) => (
          <div className="review-card" key={r.name}>
            <img src={r.image} alt={r.name} className="review-photo" />
            <div className="review-body">
              <div className="review-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} filled={i < r.rating} />
                ))}
              </div>
              <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              <span className="review-name">{r.name}</span>
              <span className="review-role">Verified Buyer</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Reviews
