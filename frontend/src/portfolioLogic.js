import { useState, useEffect } from 'react' 

// ========== TYPING ANIMATION ==========
export function useTypingAnimation(setTypedText) {
  useEffect(() => {
    const words = ["University Student🎓", "Videographer🎥", "Photographer📸", "Creator🖌️"]
    let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100
    let timeoutId

    function typeEffect() {
      const currentWord = words[wordIndex]
      if (isDeleting) {
        setTypedText(currentWord.substring(0, charIndex - 1))
        charIndex--
        typingSpeed = 50
      } else {
        setTypedText(currentWord.substring(0, charIndex + 1))
        charIndex++
        typingSpeed = 120
      }
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true
        typingSpeed = 1500
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false
        wordIndex = (wordIndex + 1) % words.length
        typingSpeed = 500
      }
      timeoutId = setTimeout(typeEffect, typingSpeed)
    }

    const initialTimeout = setTimeout(typeEffect, 500)
    
    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(timeoutId)
    }
  }, [setTypedText])
}

// ========== THEME MANAGER ==========
export function useThemeManager() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme === 'light') {
      setTheme('light')
      document.body.classList.add('light-mode')
    } else {
      setTheme('dark')
      document.body.classList.remove('light-mode')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    if (newTheme === 'dark') {
      document.body.classList.remove('light-mode')
      localStorage.setItem('portfolio-theme', 'dark')
    } else {
      document.body.classList.add('light-mode')
      localStorage.setItem('portfolio-theme', 'light')
    }
  }

  const getThemeIcon = () => theme === 'dark' ? '🌙' : '☀️'
  const getThemeText = () => theme === 'dark' ? 'Dark Mode' : 'Light Mode'

  return { theme, toggleTheme, getThemeIcon, getThemeText }
}

// ========== TIMELINE PROGRESS ==========
export function useTimelineProgress(setProgressHeight, timelineContainerRef, progressFillRef, educationSectionRef) {
  useEffect(() => {
    const updateTimelineProgress = () => {
      const timelineContainer = timelineContainerRef.current
      const progressFill = progressFillRef.current
      const educationSection = educationSectionRef.current
      
      if (!timelineContainer || !progressFill || !educationSection) return
      
      const windowHeight = window.innerHeight
      const viewportCenter = windowHeight / 2
      const sectionRect = educationSection.getBoundingClientRect()
      let percentage = 0
      
      if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
        if (sectionRect.top <= viewportCenter) {
          const passedAmount = viewportCenter - sectionRect.top
          const totalHeight = sectionRect.bottom - sectionRect.top
          if (totalHeight > 0) percentage = Math.min(0.98, passedAmount / totalHeight)
        }
        const timelineItems = document.querySelectorAll('.timeline-item')
        timelineItems.forEach((item, index) => {
          const dot = item.querySelector('.timeline-dot')
          if (dot) {
            const dotRect = dot.getBoundingClientRect()
            const dotCenter = dotRect.top + (dotRect.height / 2)
            if (dotCenter <= viewportCenter) {
              percentage = Math.max(percentage, (index + 1) / timelineItems.length)
            }
          }
        })
      }
      if (sectionRect.bottom <= 0) percentage = 0.98
      setProgressHeight((Math.min(0.98, Math.max(0, percentage)) * 100) + "%")
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateTimelineProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateTimelineProgress)
    
    setTimeout(updateTimelineProgress, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateTimelineProgress)
    }
  }, [setProgressHeight, timelineContainerRef, progressFillRef, educationSectionRef])
}

// ========== SMOOTH NAVIGATION ==========
export function useSmoothNavigation() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href')
        if (targetId && targetId !== "#" && targetId.startsWith('#')) {
          e.preventDefault()
          const targetElement = document.querySelector(targetId)
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      })
    })
  }, [])
}

// ========== CONTACT FORM HANDLER ==========
export function handleFormSubmit(e, nameInputRef, emailInputRef, msgInputRef, contactFormRef, setFormFeedback) {
  e.preventDefault()
  const name = nameInputRef.current?.value.trim()
  const email = emailInputRef.current?.value.trim()
  const msg = msgInputRef.current?.value.trim()
  
  if (!name || !email || !msg) {
    setFormFeedback({
      message: "⚠️ Please fill all fields.",
      color: "#ffaa66"
    })
    setTimeout(() => {
      setFormFeedback(prev => {
        if (prev.message.includes("fill")) {
          return { message: '', color: '' }
        }
        return prev
      })
    }, 3000)
    return
  }

  // Show sending message
  setFormFeedback({
    message: "📧 Sending your message...",
    color: "#ccff33"
  })

  // Send email to backend
  fetch('http://localhost:5000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message: msg })
  })
  .then(response => response.json())
  .then(data => {
    setFormFeedback({
      message: data.message || '✅ Email sent successfully!',
      color: data.message?.includes('✅') ? "#59ff00" : "#ffaa66"
    })
    
    if (contactFormRef.current) {
      contactFormRef.current.reset()
    }
    
    setTimeout(() => setFormFeedback({ message: '', color: '' }), 4000)
  })
  .catch(error => {
    console.error('Contact form error:', error)
    setFormFeedback({
      message: '❌ Failed to send email. Check your connection.',
      color: "#ff6666"
    })
    setTimeout(() => setFormFeedback({ message: '', color: '' }), 4000)
  })
}

// ========== LOADER EFFECT ==========
export function useLoader() {
  useEffect(() => {
    const loader = document.getElementById('loaderWrapper')
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hide')
        setTimeout(() => {
          loader.style.display = 'none'
        }, 500)
      }, 500)
    }
  }, [])
}