'use client'

import { useState, useEffect } from 'react'
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaRedo, 
  FaStar, 
  FaCog,
  FaLock,
  FaGlobe,
  FaExpand,
  FaCompress
} from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'
import { useSystemSounds } from '@/hooks/useSystemSounds'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Bookmark {
  id: string
  title: string
  url: string
  icon?: string
  favicon?: string
}

const DEFAULT_BOOKMARKS: Bookmark[] = [
  // {
  //   id: 'amazon',
  //   title: 'Amazon',
  //   url: 'https://amazon.com',
  //   icon: '🛒',
  //   favicon: '/icons/amazon-favicon.png'
  // },
  {
    id: 'blog',
    title: 'Blog',
    url: 'https://blog.hash8m.com',
    icon: '📝',
    favicon: '/icons/blog-favicon.png'
  },
  {
    id: 'hash8m',
    title: 'Hash8m',
    url: 'https://hash8m.com',
    icon: '🌐'
  },
  {
    id: 'tamara',
    title: 'Tamara',
    url: 'https://tamara.co',
    icon: '💳'
  },
]

interface BrowserProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
}

type CheckoutStep = 'select-payment' | 'card-review' | 'processing' | 'complete' | 
  'tamara-review' | 'tamara-otp' | 'tamara-processing';

export const Browser = ({ isOpen, onClose, onMinimize }: BrowserProps) => {
  const [currentUrl, setCurrentUrl] = useState('https://blog.hash8m.com')
  const [displayUrl, setDisplayUrl] = useState('https://blog.hash8m.com')
  const [urlHistory, setUrlHistory] = useState<string[]>(['https://blog.hash8m.com'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [bookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const sounds = useSystemSounds()
  const [showPopup, setShowPopup] = useState(false)
  const [isAmazonCheckout, setIsAmazonCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('select-payment');

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const navigateTo = (url: string) => {
    // Add http:// if missing
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    
    // Check if navigating to Amazon
    const isAmazon = formattedUrl.includes('amazon.sa') || 
      formattedUrl.includes('amazon.com') ||
      formattedUrl.includes('checkout.amazon');
    
    setIsAmazonCheckout(isAmazon)
    
    // Handle checkout step URLs
    if (isAmazon && formattedUrl.includes('#checkout')) {
      const step = formattedUrl.split('#checkout-')[1] as CheckoutStep
      setCheckoutStep(step)
    } else if (isAmazon) {
      setCheckoutStep('select-payment')
    }
    
    setCurrentUrl(formattedUrl)
    setDisplayUrl(formattedUrl)
    
    // Update history
    const newHistory = urlHistory.slice(0, historyIndex + 1)
    newHistory.push(formattedUrl)
    setUrlHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      const prevUrl = urlHistory[historyIndex - 1]
      setCurrentUrl(prevUrl)
      setDisplayUrl(prevUrl)
      
      // Handle checkout step navigation
      if (isAmazonCheckout) {
        if (prevUrl.includes('#checkout')) {
          const step = prevUrl.split('#checkout-')[1] as CheckoutStep
          setCheckoutStep(step)
        } else {
          setCheckoutStep('select-payment')
        }
      }
    }
  }

  const handleForward = () => {
    if (historyIndex < urlHistory.length - 1) {
      setHistoryIndex(prev => prev + 1)
      const nextUrl = urlHistory[historyIndex + 1]
      setCurrentUrl(nextUrl)
      setDisplayUrl(nextUrl)
      
      // Handle checkout step navigation
      if (isAmazonCheckout) {
        if (nextUrl.includes('#checkout')) {
          const step = nextUrl.split('#checkout-')[1] as CheckoutStep
          setCheckoutStep(step)
        } else {
          setCheckoutStep('select-payment')
        }
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sounds.playClick()
      navigateTo(displayUrl)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const handleCardCheckout = () => {
    navigateTo(`${currentUrl}#checkout-card-review`);
  };

  const handleConfirmCardPayment = () => {
    navigateTo(`${currentUrl}#checkout-processing`);
    // Simulate processing time
    setTimeout(() => {
      navigateTo(`${currentUrl}#checkout-complete`);
    }, 2000);
  };

  const handleTamaraCheckout = () => {
    navigateTo(`${currentUrl}#checkout-tamara-review`);
  };

  const handleTamaraConfirm = () => {
    navigateTo(`${currentUrl}#checkout-tamara-otp`);
  };

  const handleTamaraOTP = () => {
    navigateTo(`${currentUrl}#checkout-tamara-processing`);
    // Simulate processing time
    setTimeout(() => {
      navigateTo(`${currentUrl}#checkout-complete`);
    }, 2000);
  };

  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 'card-review':
        return (
          <div className="w-full max-w-2xl mx-auto p-8 text-black">
            <h2 className="text-2xl font-medium mb-6">Review your order</h2>
            
            <div className="bg-[#f3f3f3] p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span>Order total:</span>
                <span className="font-bold">SAR 219.00</span>
              </div>
              <div className="text-sm">
                By placing your order, you agree to Amazon&apos;s privacy notice and conditions of use.
              </div>
            </div>

            <button
              onClick={handleConfirmCardPayment}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-3 rounded-lg font-medium"
            >
              Place your order
            </button>
          </div>
        );

      case 'processing':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#232f3e] mx-auto mb-4"></div>
              <p className="text-lg text-black">Processing your payment...</p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="w-full max-w-2xl mx-auto p-8 text-black text-center">
            <div className="text-green-600 mb-4 text-5xl">✓</div>
            <h2 className="text-2xl font-medium mb-4">Order placed, thank you!</h2>
            <p className="mb-6">Confirmation will be sent to your email.</p>
            <div className="bg-[#f3f3f3] p-4 rounded-lg mb-6 text-left">
              <h3 className="font-medium mb-2">Order Details</h3>
              <p>Order #: 123-4567890-1234567</p>
              <p>Total: SAR 219.00</p>
              <p>Estimated delivery: 3-5 business days</p>
            </div>
            <button
              onClick={() => {
                setCheckoutStep('select-payment');
                navigateTo('https://amazon.sa');
              }}
              className="bg-[#232f3e] text-white px-6 py-2 rounded hover:bg-[#374151]"
            >
              Continue Shopping
            </button>
          </div>
        );

      case 'tamara-review':
        return (
          <div className="w-full max-w-2xl mx-auto p-8 text-black">
            <h2 className="text-2xl font-medium mb-6">Tamara - Pay in 4</h2>
            
            <div className="bg-[#f3f3f3] p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-4">
                <span>Order total:</span>
                <span className="font-bold">SAR 219.00</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>4 payments of:</span>
                  <span className="font-bold">SAR 54.75</span>
                </div>
                <div className="text-sm text-gray-600">
                  No fees, 0% interest
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="+966 XX XXX XXXX"
                />
              </div>
            </div>

            <button
              onClick={handleTamaraConfirm}
              className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-white py-3 rounded-lg font-medium"
            >
              Continue with Tamara
            </button>
          </div>
        );

      case 'tamara-otp':
        return (
          <div className="w-full max-w-2xl mx-auto p-8 text-black">
            <h2 className="text-2xl font-medium mb-6">Verify your phone number</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                We&apos;ve sent a verification code to your phone number
              </p>
              <div className="flex gap-2 justify-center">
                {[1,2,3,4].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 rounded"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleTamaraOTP}
              className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-white py-3 rounded-lg font-medium"
            >
              Verify & Pay
            </button>
          </div>
        );

      case 'tamara-processing':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2c3e50] mx-auto mb-4"></div>
              <p className="text-lg text-black">Processing your Tamara payment...</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-medium mb-6 text-black">Select a payment method</h2>
            
            {/* Credit/Debit Card Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-4 items-center">
                  <Image 
                    src="/Visa_Logo_2014.png" 
                    alt="Visa" 
                    width={60}
                    height={32}
                    className="h-8 object-contain"
                  />
                  <Image 
                    src="/mastercard-logo.png" 
                    alt="Mastercard" 
                    width={50}
                    height={32}
                    className="h-8 object-contain"
                  />
                  <Image 
                    src="/Mada_Logo.svg.png" 
                    alt="Mada" 
                    width={70}
                    height={32}
                    className="h-8 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium text-black">Credit or Debit Card</h3>
              </div>
              
              <div className="space-y-4 mb-4 text-black">
                <div>
                  <label className="block text-sm mb-1">Card number</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Expiry date</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">CVV</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Name on card</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>
            
            {/* Buy Now Pay Later Section */}
            <div 
              onClick={handleTamaraCheckout}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:border-[#2c3e50]"
            >
              <div className="flex items-center gap-4">
                <Image 
                  src="/standalone_installment_4x._CB567992720_.png" 
                  alt="Tamara" 
                  width={120}
                  height={48}
                  className="h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-medium text-black">Buy Now, Pay Later with Tamara</h3>
                  <p className="text-sm text-gray-600">Split into 4 interest-free payments</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleCardCheckout}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-3 rounded-lg font-medium"
            >
              Use this payment method
            </button>
          </div>
        );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 15000) // Show after 12 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <WindowFrame
      title="Browser"
      icon={<FaGlobe />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      isFullScreen={isFullScreen}
      defaultSize={{ width: '900px', height: '600px' }}
      defaultPosition={{ x: 40, y: 40 }}
    >
      <div className="flex flex-col h-full w-full bg-[#1a1a1a]">
        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-2 bg-[#2a2a2a] border-b border-white/10">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-md ${
                historyIndex > 0 ? 'hover:bg-white/10 text-white' : 'text-white/30'
              }`}
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleForward}
              disabled={historyIndex >= urlHistory.length - 1}
              className={`p-2 rounded-md ${
                historyIndex < urlHistory.length - 1 ? 'hover:bg-white/10 text-white' : 'text-white/30'
              }`}
            >
              <FaArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo(currentUrl)}
              className="p-2 rounded-md hover:bg-white/10 text-white"
            >
              <FaRedo className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center bg-[#333333] rounded-md px-3 py-1.5">
            <FaLock className="w-3 h-3 text-green-500 mr-2" />
            <input
              type="text"
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-white text-sm"
            />
          </div>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-md hover:bg-white/10 ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <FaStar className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-md hover:bg-white/10 text-white"
          >
            {isFullScreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
          </button>

          <button className="p-2 rounded-md hover:bg-white/10 text-white">
            <FaCog className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#252525] border-b border-white/10">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => navigateTo(bookmark.url)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md 
                       hover:bg-white/10 text-white/90 transition-colors
                       ${currentUrl === bookmark.url ? 'bg-white/10' : ''}`}
            >
              <span className="text-base">{bookmark.icon}</span>
              <span className="text-sm">{bookmark.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 w-full overflow-hidden relative">
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1a1a1a]">
              <div className="h-full bg-blue-500 animate-pulse" />
            </div>
          )}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
              >
                <div className="flex flex-col gap-3">
                  <p className="font-semibold">Interested in building the future?</p>
                  <p>Join Tamara and Build the Future of Finance!</p>
                  <div className="flex justify-end gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigateTo('https://tamara.co/careers')
                        setShowPopup(false)
                      }}
                      className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50"
                    >
                      Learn More
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPopup(false)}
                      className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isAmazonCheckout ? (
            <div className="w-full h-full bg-white overflow-y-auto">
              {/* Top Navigation Bar */}
              <div className="w-full bg-[#232f3e] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Image 
                    src="/amazon-logo-transparent.png" 
                    alt="Amazon.sa" 
                    width={24}
                    height={24}
                    className="h-8"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-white ml-4 text-lg">
                    {checkoutStep === 'complete' ? 'Order Complete' : 'Secure checkout'} ▼
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <span className="mr-4">🛒 Cart</span>
                </div>
              </div>

              <div className="max-w-5xl mx-auto px-4 py-6 text-black">
                {renderCheckoutStep()}
              </div>
            </div>
          ) : (
            <iframe
              src={currentUrl}
              className="w-full h-full border-none bg-white"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              referrerPolicy="no-referrer"
              onLoad={handleIframeLoad}
            />
          )}
        </div>
      </div>
    </WindowFrame>
  )
}