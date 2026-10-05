import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import { perfumes } from '../data/perfumes'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const BG_TRANSITION = { duration: 0.6, ease: 'easeInOut' }


const Hero = () => {
  const [[index, direction], setSlide] = useState([0, 1])
  const heroRef = useRef(null)
  const bottleFlyRefs = useRef({})
  const len = perfumes.length
  const current = perfumes[index]

  const goTo = (nextIndex, dir) => setSlide([nextIndex, dir])
  const prev = () => goTo((index - 1 + len) % len, -1)
  const next = () => goTo((index + 1) % len, 1)

  // Flies the currently active bottle down out of the hero and into its
  // matching (intentionally empty) Best Sellers card slot as the user
  // scrolls - same scroll-scrubbed transform technique as the ice-cream
  // reference Hero: animate the real element via GSAP ScrollTrigger, no
  // clone needed.
  useLayoutEffect(() => {
    const flyEl = bottleFlyRefs.current[current.id]
    const cardImg = document.querySelector(
      `.bs-card-img[data-perfume-id="${current.id}"]`
    )
    const card = cardImg?.closest('.bs-card')
    if (!flyEl || !cardImg || !card) return

    document.querySelectorAll('.bs-card-img').forEach((img) => {
      img.style.opacity = ''
    })
    cardImg.style.opacity = '0'

    let ctx
    let cancelled = false

    const initAnimation = () => {
      if (cancelled) return
      ctx?.revert()

      ctx = gsap.context(() => {
        const srcBottle = flyEl.querySelector('.hero-bottle-img')
        if (!srcBottle) return

        const dstRect = cardImg.getBoundingClientRect()
        const srcRect = srcBottle.getBoundingClientRect()
        const flyElRect = flyEl.getBoundingClientRect()

        // Wait if images haven't measured any size yet
        if (!dstRect.width || !srcRect.width) {
          setTimeout(initAnimation, 120)
          return
        }

        const srcCx = srcRect.left + srcRect.width / 2
        const srcCy = srcRect.top + srcRect.height / 2
        const dstCx = dstRect.left + dstRect.width / 2
        const dstCy = dstRect.top + dstRect.height / 2
        const wCx = flyElRect.left + flyElRect.width / 2
        const wCy = flyElRect.top + flyElRect.height / 2
        const scale = dstRect.width / srcRect.width

        const isMobile = window.innerWidth <= 860
        const visualEl = flyEl.closest('.hero-visual')

        // On mobile, trigger when the bottle is in clear view so it lifts off in front of the user
        const startTrigger = isMobile && visualEl ? visualEl : heroRef.current
        const startPos = isMobile ? 'top 65%' : 'top top'
        const endPos = isMobile ? 'top 120px' : 'top 140px'

        gsap.set(flyEl, { zIndex: 300, opacity: 1 })

        const x = dstCx - wCx - scale * (srcCx - wCx)
        const y = dstCy - wCy - scale * (srcCy - wCy)

        gsap.to(flyEl, {
          x,
          y,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: startTrigger,
            start: startPos,
            endTrigger: card,
            end: endPos,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress > 0 && self.progress < 1) {
                heroRef.current.style.zIndex = '900'
                flyEl.style.zIndex = '950'
                flyEl.style.opacity = '1'
              } else if (self.progress <= 0) {
                heroRef.current.style.zIndex = ''
                flyEl.style.zIndex = '300'
              }
            },
            onLeave: () => {
              cardImg.style.opacity = '1'
              flyEl.style.opacity = '0'
              heroRef.current.style.zIndex = ''
              flyEl.style.zIndex = ''
            },
            onEnterBack: () => {
              cardImg.style.opacity = '0'
              flyEl.style.opacity = '1'
              heroRef.current.style.zIndex = '900'
              flyEl.style.zIndex = '950'
            },
            onLeaveBack: () => {
              cardImg.style.opacity = '0'
              flyEl.style.opacity = '1'
              heroRef.current.style.zIndex = ''
              flyEl.style.zIndex = '300'
            },
          },
        })
      }, heroRef)
    }

    const waitImage = (img) => {
      if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve()
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
        setTimeout(resolve, 800)
      })
    }

    const heroBottleImg = flyEl.querySelector('.hero-bottle-img')
    const loaderExists = document.querySelector('.loader') !== null
    const delay = loaderExists ? 2150 : 350

    Promise.all([
      new Promise((resolve) => setTimeout(resolve, delay)),
      waitImage(cardImg),
      waitImage(heroBottleImg),
      document.fonts?.ready ?? Promise.resolve(),
    ]).then(() => {
      if (cancelled) return
      initAnimation()
      ScrollTrigger.refresh()
    })

    const handleLoaderDone = () => {
      setTimeout(() => {
        if (!cancelled) {
          initAnimation()
          ScrollTrigger.refresh()
        }
      }, 100)
    }
    window.addEventListener('loader-done', handleLoaderDone)

    return () => {
      cancelled = true
      window.removeEventListener('loader-done', handleLoaderDone)
      ctx?.revert()
      cardImg.style.opacity = ''
      flyEl.style.opacity = ''
      heroRef.current.style.zIndex = ''
      gsap.set(flyEl, { zIndex: '', x: 0, y: 0, scale: 1 })
    }
  }, [index, current.id])

  return (
    <section id="home" className="hero" ref={heroRef}>
      <motion.div
        className="hero-bg-layer"
        animate={{ backgroundColor: current.bgColor }}
        transition={BG_TRANSITION}

      >
        <motion.div
          className="hero-circle hero-circle--left"
          animate={{ backgroundColor: current.circleColor }}
          transition={BG_TRANSITION}
        />
        <motion.div
          className="hero-circle hero-circle--right"
          animate={{ backgroundColor: current.circleColor }}
          transition={BG_TRANSITION}
        />
      </motion.div>

      <Navbar />

      <div className="hero-main">
        <div className="hero-pills">
          {perfumes.map((p) => (
            <button
              key={p.id}
              className={`hero-pill ${p.id === current.id ? 'is-current' : ''}`}
              style={p.id === current.id ? { color: current.bgColor } : undefined}
              onClick={() => {
                const target = perfumes.findIndex((pf) => pf.id === p.id)
                if (target === index) return
                goTo(target, target > index ? 1 : -1)
              }}
            >
              {p.tag}
            </button>
          ))}
        </div>

        <div className="hero-body">
          <motion.div
            className="hero-text"
            animate={{ color: current.textColor }}
            transition={BG_TRANSITION}
          >
            <h1>
              <span className="hero-title-word">
                Regal
                <svg className="hero-title-leaf" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20c0-8 6-14 14-14 0 8-6 14-14 14Z" fill="#d5a84e" />
                </svg>
              </span>{' '}
              Heritage
              <br />
              Jewellery Scent
            </h1>
            <motion.p animate={{ color: current.subTextColor }} transition={BG_TRANSITION}>
              Crafted with rare florals, warm woods, and luminous notes inspired by heirloom jewellery and modern luxury.
            </motion.p>
            <div className="hero-actions">
              <button className="btn btn-cream" style={{ color: current.bgColor }}>
                Shop Now
              </button>
              <button className="btn btn-outline">Learn More</button>
            </div>

            <div className="hero-nav">
              <button className="hero-arrow" onClick={prev} aria-label="Previous fragrance">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="hero-nav-count">
                {String(index + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}
              </span>
              <button className="hero-arrow" onClick={next} aria-label="Next fragrance">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>

          <div className="hero-right">
            <div className="hero-visual">
              <motion.div
                className="hero-visual-mask"
                animate={{ backgroundColor: current.bgColor }}
                transition={BG_TRANSITION}
              />


              <div className="hero-visual-bottle-layer">
                {perfumes.map((p, i) => (
                  <div
                    key={p.id}
                    className="hero-bottle-fly"
                    data-perfume-id={p.id}
                    ref={(el) => (bottleFlyRefs.current[p.id] = el)}
                  >
                    <motion.img
                      src={p.bottle}
                      alt={p.name}
                      className={`hero-bottle-img ${!p.bottleIsCutout ? 'is-masked' : ''}`}
                      animate={{ opacity: i === index ? 1 : 0 }}
                      transition={{ duration: 0 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-badges">
              <div className={`hero-badge ${current.accent === 'purple' ? 'is-purple' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20c0-8 6-14 14-14 0 8-6 14-14 14Z" className="hero-badge-icon-leaf" />
                </svg>
                <span>
                  100%
                  <br />
                  Organic
                </span>
              </div>
              <div className={`hero-badge ${current.accent === 'purple' ? 'is-purple' : ''}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3c3.5 4 6 7.4 6 10.5A6 6 0 1 1 6 13.5C6 10.4 8.5 7 12 3Z"
                    className="hero-badge-icon-drop"
                  />
                </svg>
                <span>
                  Natural
                  <br />
                  Essential Oils
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
