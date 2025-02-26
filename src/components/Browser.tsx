'use client'

import { useState, useEffect, useRef } from 'react'
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
import Image from 'next/image'

interface Bookmark {
  id: string
  title: string
  url: string
  icon?: string
  favicon?: string
}

const DEFAULT_BOOKMARKS: Bookmark[] = [
   {
   id: 'amazon',
   title: 'Amazon',
   url: 'https://amazon.com',
   icon: '🛒',
   favicon: '/icons/amazon-favicon.png'
  },
  {
    id: 'blog',
    title: 'Blog',
    url: 'https://blog.hash8m.com',
    icon: '📄',
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
  'tamara-review' | 'tamara-otp' | 'tamara-processing' | 'tamara-installment';

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
  const [isAmazonCheckout, setIsAmazonCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('select-payment')
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [otpValues, setOtpValues] = useState(['0', '0', '0', '0'])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [resendTimer, setResendTimer] = useState(28)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [failedFavicons, setFailedFavicons] = useState<Set<string>>(new Set())

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const navigateTo = (url: string) => {
    // Add http:// if missing
    let formattedUrl = url.startsWith('http') ? url : `https://${url}`
    
    // Fix for URL fragment handling
    // If the URL contains a #checkout fragment, extract the base URL first
    if (formattedUrl.includes('#checkout')) {
      // Extract base URL (everything before the first #)
      const baseUrl = formattedUrl.split('#')[0]
      // Extract the checkout step (everything after the last #checkout-)
      const checkoutPart = formattedUrl.substring(formattedUrl.lastIndexOf('#checkout-'))
      // Rebuild the URL properly
      formattedUrl = baseUrl + checkoutPart
    }
    
    // Check if navigating to Amazon
    const isAmazon = formattedUrl.includes('amazon.sa') || 
      formattedUrl.includes('amazon.com') ||
      formattedUrl.includes('checkout.amazon')
    
    setIsAmazonCheckout(isAmazon)
    
    // Handle checkout step URLs
    if (isAmazon && formattedUrl.includes('#checkout')) {
      console.log('Parsing checkout step:', formattedUrl)
      const step = formattedUrl.split('#checkout-')[1] as CheckoutStep
      console.log('Parsed step:', step)
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
    if (!isFullScreen) {
      setIsMaximized(true)
    } else {
      setIsMaximized(false)
    }
  }

  const handleCardCheckout = () => {
    navigateTo(`${currentUrl}#checkout-card-review`)
  }

  const handleConfirmCardPayment = () => {
    navigateTo(`${currentUrl}#checkout-processing`)
    // Simulate processing time
    setTimeout(() => {
      navigateTo(`${currentUrl}#checkout-complete`)
    }, 2000)
  }

  const handleTamaraCheckout = () => {
    navigateTo(`${currentUrl}#checkout-tamara-review`)
  }

  const handleTamaraConfirm = () => {
    navigateTo(`${currentUrl}#checkout-tamara-otp`)
  }

  const handleTamaraOTP = () => {
    if (termsAccepted) {
      navigateTo(`${currentUrl}#checkout-tamara-processing`)
      // Simulate processing time
      setTimeout(() => {
        navigateTo(`${currentUrl}#checkout-tamara-installment`)
      }, 2000)
    }
  }

  const handleMinimize = () => {
    sounds.playMinimize()
    setIsMinimized(true)
    if (onMinimize) {
      onMinimize()
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)
      
      // Auto-focus next input
      if (value && index < 3 && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (checkoutStep === 'tamara-otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [checkoutStep, resendTimer])

  useEffect(() => {
    if (checkoutStep === 'tamara-otp') {
      setResendTimer(28)
      setOtpValues(['0', '0', '0', '0'])
      setTermsAccepted(false)
    }
  }, [checkoutStep])

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
        )

      case 'processing':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#232f3e] mx-auto mb-4"></div>
              <p className="text-lg text-black">Processing your payment...</p>
            </div>
          </div>
        )

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
                setCheckoutStep('select-payment')
                navigateTo('https://amazon.sa')
              }}
              className="bg-[#232f3e] text-white px-6 py-2 rounded hover:bg-[#374151]"
            >
              Continue Shopping
            </button>
          </div>
        )

      case 'tamara-review':
        return (
          <div className="w-full h-full flex flex-col bg-white">
            {/* Remove the black navigation bar completely */}
            
            <div className="flex-1 flex flex-col items-center p-6 max-w-md mx-auto">
              {/* Add tamara text back with black color */}
              <div className="w-full mb-6">
                <div className="mb-1">
                  <span className="font-semibold text-black"></span>
                </div>
                <span className="text-xl font-medium text-black">Split in 4 with Tamara</span>
              </div>
              
              <div className="w-full bg-[#f6f6f6] p-4 rounded-md mb-6">
                <div className="flex justify-between mb-3 text-black">
                  <span>Order total:</span>
                  <span className="font-semibold">SAR 219.00</span>
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm text-black">
                    <span>4 payments of:</span>
                    <span className="font-semibold">SAR 54.75</span>
                  </div>
                  <div className="text-sm text-black">
                    No fees, 0% interest
                  </div>
                </div>
              </div>

              <div className="w-full mb-6">
                <label className="block text-sm mb-2 text-black">Phone Number</label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="bg-gray-50 flex items-center py-2 px-3 border-r border-gray-300">
                    {process.env.NODE_ENV === 'development' ? (
                      <SaudiFlag />
                    ) : (
                      <Image 
                        src="/flag-sa.png" 
                        alt="Saudi Arabia" 
                        width={24} 
                        height={16} 
                        className="object-cover" 
                      />
                    )}
                  </div>
                  <input 
                    type="tel" 
                    className="flex-1 py-2 px-3 outline-none text-black"
                    placeholder="5xx xxx xxxx"
                    defaultValue="537577553"
                  />
                </div>
              </div>
              
              <button
                onClick={handleTamaraConfirm}
                className="w-full py-3 rounded-md font-medium text-white bg-[#2B3F53] hover:bg-[#1F2937] transition-colors"
              >
                Continue with Tamara
              </button>
              
              <div className="text-xs text-black mt-4 text-center">
                By continuing, you agree to Tamara&apos;s <a href="#" className="text-[#2B3F53]">Terms & Conditions</a> and <a href="#" className="text-[#2B3F53]">Privacy Policy</a>
              </div>
            </div>
          </div>
        )

      case 'tamara-otp':
        return (
          <div className="w-full h-full flex flex-col bg-white">
            {/* Remove the black navigation bar completely */}
            
            <div className="flex-1 flex flex-col p-6 max-w-md mx-auto">
              {/* Add tamara text back with black color */}
              <div className="w-full mb-2">
                <span className="font-semibold text-black">tamara</span>
              </div>
              
              <h2 className="text-xl font-medium mb-8 text-black">Verify your mobile number</h2>
              
              <div className="w-full mb-6">
                <label className="block text-sm mb-2 text-black">Phone Number</label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <div className="bg-gray-50 flex items-center py-2 px-3 border-r border-gray-300">
                    {process.env.NODE_ENV === 'development' ? (
                      <SaudiFlag />
                    ) : (
                      <Image 
                        src="/flag-sa.png" 
                        alt="Saudi Arabia" 
                        width={24} 
                        height={16} 
                        className="object-cover" 
                      />
                    )}
                  </div>
                  <input 
                    type="tel" 
                    className="flex-1 py-2 px-3 outline-none text-black"
                    placeholder="5xx xxx xxxx"
                    defaultValue="537577553"
                  />
                </div>
              </div>
              
              <div className="w-full mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-black">OTP</label>
                  <button 
                    className="text-sm text-black"
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
                <div className="flex gap-3 justify-between">
                  {otpValues.map((value, i) => (
                    <input
                      key={i}
                      ref={(el: HTMLInputElement | null) => {
                        otpRefs.current[i] = el
                      }}
                      type="text"
                      value={value}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      maxLength={1}
                      className="w-full h-16 text-center text-xl border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none text-black bg-white"
                    />
                  ))}
                </div>
                <div className="text-xs text-black mt-2 text-center">
                  We&apos;ve sent a verification code to your mobile number
                </div>
              </div>
              
              <div className="w-full mb-6 flex items-start gap-2">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#F18C70] focus:ring-[#F18C70]" 
                  id="terms-checkbox"
                />
                <label htmlFor="terms-checkbox" className="text-sm text-black">
                  I accept Tamara&apos;s <a href="#" className="text-[#F18C70]">Terms & Conditions</a>
                </label>
              </div>

              <button
                onClick={handleTamaraOTP}
                disabled={!termsAccepted}
                className="w-full py-3 rounded-md font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors"
              >
                Confirm your account
              </button>
            </div>
          </div>
        )

      case 'tamara-processing':
        return (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="w-full bg-black text-white py-2 px-4">
              <span className="font-semibold text-sm">tamara</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-center mb-4">
                <div className="lds-ring mx-auto mb-6">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p className="text-black text-lg">Processing your payment...</p>
              </div>
              
              <style jsx>{`
                .lds-ring {
                  display: inline-block;
                  position: relative;
                  width: 32px;
                  height: 32px;
                }
                .lds-ring div {
                  box-sizing: border-box;
                  display: block;
                  position: absolute;
                  width: 28px;
                  height: 28px;
                  margin: 8px;
                  border: 4px solid #F18C70;
                  border-radius: 50%;
                  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                  border-color: #F18C70 transparent transparent transparent;
                }
                .lds-ring div:nth-child(1) {
                  animation-delay: -0.45s;
                }
                .lds-ring div:nth-child(2) {
                  animation-delay: -0.3s;
                }
                .lds-ring div:nth-child(3) {
                  animation-delay: -0.15s;
                }
                @keyframes lds-ring {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          </div>
        )

      case 'tamara-installment':
        return (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="w-full bg-black text-white py-2 px-4 flex items-center justify-between">
              <span className="font-semibold text-sm">tamara</span>
              <div className="flex items-center">
                <button className="bg-gray-700 text-white text-xs rounded px-2 py-1 mr-2">العربية</button>
                <button className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <div className="mb-4">
                <h2 className="text-xl font-medium text-black">Hey, Hashim 👋</h2>
                <p className="text-sm text-gray-600">Complete your Amazon order</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left column - Order Detail and Payment Method */}
                <div className="flex-1">
                  <div className="border-b pb-4 mb-4">
                    <h3 className="font-medium text-black mb-4">Order Detail</h3>
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="text-black">SAR 219.00</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18v12H3V6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M3 10h18M7 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Wallet balance
                      </span>
                      <span className="text-black">SAR -1.78</span>
                    </div>
                    
                    <div className="flex justify-between font-medium mt-3">
                      <span className="text-black">Total</span>
                      <span className="text-black">SAR 217.22</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-black mb-4">Payment Method</h3>
                    
                    <div className="mb-2 text-sm text-gray-600">
                      Pay with
                    </div>
                    
                    <div className="border rounded-md p-3 mb-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-6 bg-green-500 rounded mr-2 flex items-center justify-center text-white text-xs">
                          mada
                        </div>
                        <span className="text-black">•••• 7816</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-[#F18C70] flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#F18C70] rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3 mb-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-6 bg-green-500 rounded mr-2 flex items-center justify-center text-white text-xs">
                          mada
                        </div>
                        <span className="text-black">•••• 3220</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    </div>
                    
                    <div className="border rounded-md p-3 mb-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-6 bg-blue-500 rounded mr-2 flex items-center justify-center text-white text-xs">
                          visa
                        </div>
                        <span className="text-black">•••• 9062</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    </div>
                    
                    <div className="border rounded-md p-3 mb-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-6 bg-blue-500 rounded mr-2 flex items-center justify-center text-white text-xs">
                          visa
                        </div>
                        <span className="text-black">•••• 4999</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    </div>
                    
                    <button className="flex items-center text-[#2B3F53] mt-3">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      New card
                    </button>
                    
                    <div className="text-xs text-gray-500 mt-4">
                      Your card will be automatically charged on each due date for this order.
                    </div>
                  </div>
                </div>
                
                {/* Right column - Payment Plan */}
                <div className="flex-1 bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-black mb-4">Payment Plan</h3>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-black mb-2">Split in 4</div>
                    
                    <div className="mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <div className="flex justify-between w-full">
                        <span className="text-sm text-black">Due today</span>
                        <span className="text-sm font-medium text-black">SAR 54.75</span>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <div className="flex justify-between w-full">
                        <span className="text-sm text-black">26th of March</span>
                        <span className="text-sm text-black">SAR 54.75</span>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <div className="flex justify-between w-full">
                        <span className="text-sm text-black">26th of April</span>
                        <span className="text-sm text-black">SAR 54.75</span>
                      </div>
                    </div>
                    
                    <div className="mb-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <div className="flex justify-between w-full">
                        <span className="text-sm text-black">26th of May</span>
                        <span className="text-sm text-black">SAR 54.75</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-black">Total</span>
                      <span className="text-sm font-medium text-black">SAR 219.00</span>
                    </div>
                    <div className="text-xs text-black flex items-center">
                      Inclusive of SAR 2.19 Processing fee
                      <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 16v-5M12 7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-black">Pay today</span>
                      <span className="font-medium text-black">SAR 54.75</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigateTo(`${currentUrl}#checkout-complete`)
                      }}
                      className="w-full py-3 rounded-md font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                    >
                      Pay SAR 26.13
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

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
        )
    }
  }

  return (
    <WindowFrame
      title="Browser"
      icon={<FaGlobe />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={handleMinimize}
      isFullScreen={isFullScreen}
      defaultSize={{ width: '900px', height: '600px' }}
      defaultPosition={{ x: 40, y: 40 }}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
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
                historyIndex < urlHistory.length - 1 
                  ? 'hover:bg-white/10 text-white' 
                  : 'text-white/30'
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
          
          {/* URL Bar */}
          <div className="flex-1 flex items-center bg-[#333333] rounded-md px-2 border border-white/10">
            {currentUrl.startsWith('https') ? (
              <FaLock className="w-3 h-3 text-green-500 mr-2" />
            ) : (
              <FaGlobe className="w-3 h-3 text-gray-400 mr-2" />
            )}
            <input
              type="text"
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white py-2 text-sm"
              placeholder="Enter URL"
            />
          </div>
          
          {/* Right Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-md hover:bg-white/10 
                ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
            >
              <FaStar className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-md hover:bg-white/10 text-white"
            >
              {isFullScreen ? (
                <FaCompress className="w-4 h-4" />
              ) : (
                <FaExpand className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => {}}
              className="p-2 rounded-md hover:bg-white/10 text-white"
            >
              <FaCog className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Bookmarks Bar */}
        <div className="flex items-center gap-2 p-2 bg-[#262626] border-b border-white/10 overflow-x-auto">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => navigateTo(bookmark.url)}
              className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white/10 text-sm text-white whitespace-nowrap"
            >
              {bookmark.favicon && !failedFavicons.has(bookmark.id) ? (
                <Image 
                  src={bookmark.favicon} 
                  alt={bookmark.title} 
                  width={16} 
                  height={16} 
                  className="w-4 h-4"
                  onError={() => {
                    setFailedFavicons(prev => new Set([...prev, bookmark.id]));
                  }}
                />
              ) : (
                <span>{bookmark.icon}</span>
              )}
              {bookmark.title}
            </button>
          ))}
        </div>
        
        {/* Browser Content */}
        <div className="flex-1 bg-white overflow-auto relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {/* Special Pages - Checkout */}
          {isAmazonCheckout ? (
            renderCheckoutStep()
          ) : (
            <iframe
              src={currentUrl}
              className="w-full h-full border-none"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          )}
        </div>
      </div>
    </WindowFrame>
  )
}

const SaudiFlag = () => (
  <div className="w-6 h-4 bg-green-600 flex items-center justify-center text-xs text-white">
    <span className="absolute">SA</span>
  </div>
)